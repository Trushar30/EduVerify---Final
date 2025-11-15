import { User, Achievement, AchievementType, Notification, NotificationType, Report, Submission, Assignment, Feedback } from '../types';

interface DataState {
    users: User[];
    submissions: Submission[];
    reports: Report[];
    assignments: Assignment[];
    feedback: Feedback[];
}

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'id' | 'unlockedAt'>[] = [
    { type: AchievementType.FIRST_SUBMISSION, name: 'First Steps', description: 'Congratulations on making your very first submission!', icon: 'RocketLaunch' },
    { type: AchievementType.ON_TIME_SUBMISSION, name: 'Punctual Pro', description: 'Submitted an assignment before the deadline.', icon: 'Clock' },
    { type: AchievementType.INTEGRITY_ACE, name: 'Integrity Ace', description: 'Achieved a combined plagiarism and AI score below 10% on a report.', icon: 'ShieldCheck' },
    { type: AchievementType.STREAK_3, name: 'Originality Streak x3', description: 'Maintained a plagiarism score below 20% for 3 consecutive reports.', icon: 'Fire' },
    { type: AchievementType.STREAK_5, name: 'Originality Streak x5', description: 'Maintained a plagiarism score below 20% for 5 consecutive reports.', icon: 'Fire' },
    { type: AchievementType.MOST_IMPROVED, name: 'Most Improved', description: 'Significantly lowered your plagiarism score compared to a previous submission.', icon: 'ArrowTrendingUp' },
    { type: AchievementType.PROACTIVE_PLANNER, name: 'Proactive Planner', description: 'Submitted an assignment more than 48 hours before the deadline.', icon: 'CalendarDays' },
    { type: AchievementType.PERFECT_SCORE, name: 'Perfect Score', description: 'Achieved 0% plagiarism and 0% AI score on a report.', icon: 'CheckBadge' },
    { type: AchievementType.FEEDBACK_PROVIDER, name: 'Feedback Provider', description: 'Engaged with your report by providing feedback.', icon: 'ChatBubbleLeftRight' },
];

const createAchievement = (type: AchievementType): Achievement => {
    const template = ALL_ACHIEVEMENTS.find(a => a.type === type)!;
    return {
        id: `ach-${type}-${Date.now()}`,
        unlockedAt: new Date().toISOString(),
        ...template
    };
};

const createNotification = (userId: string, achievement: Achievement): Notification => {
    return {
        id: `notif-${achievement.id}`,
        userId,
        message: `Achievement Unlocked: ${achievement.name}!`,
        timestamp: new Date().toISOString(),
        read: false,
        type: NotificationType.ACHIEVEMENT_UNLOCKED,
        linkTo: '/dashboard/profile'
    };
};

export const checkAndAwardAchievements = (
    state: DataState,
    userId: string,
    trigger: 'submission' | 'report' | 'feedback',
    payload: any
): { finalAchievements: Achievement[], newNotifications: Notification[] } => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return { finalAchievements: [], newNotifications: [] };

    let newlyUnlocked: Achievement[] = [];
    let currentAchievements = [...user.achievements];

    const hasAchievement = (type: AchievementType) => currentAchievements.some(a => a.type === type);

    // --- Submission-based Achievements ---
    if (trigger === 'submission') {
        const { submission, assignment } = payload as { submission: Submission, assignment: Assignment };
        const userSubmissions = state.submissions.filter(s => s.studentId === userId);

        // First Submission
        if (userSubmissions.length === 1 && !hasAchievement(AchievementType.FIRST_SUBMISSION)) {
            newlyUnlocked.push(createAchievement(AchievementType.FIRST_SUBMISSION));
        }
        
        // On-Time Submission
        if (new Date(submission.submittedAt) <= new Date(assignment.deadline) && !hasAchievement(AchievementType.ON_TIME_SUBMISSION)) {
            newlyUnlocked.push(createAchievement(AchievementType.ON_TIME_SUBMISSION));
        }

        // Proactive Planner
        const deadline = new Date(assignment.deadline);
        const submittedAt = new Date(submission.submittedAt);
        const hoursBefore = (deadline.getTime() - submittedAt.getTime()) / (1000 * 60 * 60);
        if (hoursBefore >= 48 && !hasAchievement(AchievementType.PROACTIVE_PLANNER)) {
            newlyUnlocked.push(createAchievement(AchievementType.PROACTIVE_PLANNER));
        }
    }

    // --- Report-based Achievements ---
    if (trigger === 'report') {
        const { report } = payload as { report: Report };
        const userSubmissions = state.submissions.filter(s => s.studentId === userId);
        const userReports = state.reports
            .filter(r => userSubmissions.some(s => s.id === r.submissionId && r.status === 'PUBLISHED')) // Only consider published reports for fairness
            .sort((a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime());

        // Integrity Ace
        if (report.plagiarismScore < 10 && report.aiContentScore < 10 && !hasAchievement(AchievementType.INTEGRITY_ACE)) {
            newlyUnlocked.push(createAchievement(AchievementType.INTEGRITY_ACE));
        }

        // Perfect Score
        if (report.plagiarismScore === 0 && report.aiContentScore === 0 && !hasAchievement(AchievementType.PERFECT_SCORE)) {
            newlyUnlocked.push(createAchievement(AchievementType.PERFECT_SCORE));
        }

        // Originality Streak
        const publishedReportsIncludingCurrent = [...userReports.filter(r => r.id !== report.id), report];
        if (publishedReportsIncludingCurrent.length >= 3) {
            const recentReports = publishedReportsIncludingCurrent.slice(-5); // Get up to last 5
            const allLowPlagiarism = recentReports.every(r => r.plagiarismScore < 20);

            if (allLowPlagiarism) {
                if (recentReports.length >= 5 && !hasAchievement(AchievementType.STREAK_5)) {
                    // Award Streak 5, and remove Streak 3 if it exists to avoid clutter
                    currentAchievements = currentAchievements.filter(a => a.type !== AchievementType.STREAK_3);
                    newlyUnlocked.push(createAchievement(AchievementType.STREAK_5));
                } else if (recentReports.length >= 3 && !hasAchievement(AchievementType.STREAK_3) && !hasAchievement(AchievementType.STREAK_5)) {
                    newlyUnlocked.push(createAchievement(AchievementType.STREAK_3));
                }
            }
        }
        
        // Most Improved
        if (userReports.length >= 1 && !hasAchievement(AchievementType.MOST_IMPROVED)) {
            const previousReport = userReports[userReports.length - 1];
            if (previousReport && report.plagiarismScore <= previousReport.plagiarismScore - 20) { // A drop of 20 points or more
                newlyUnlocked.push(createAchievement(AchievementType.MOST_IMPROVED));
            }
        }
    }

    // --- Feedback-based Achievements ---
    if (trigger === 'feedback') {
        const userFeedback = state.feedback.filter(f => f.studentId === userId);
        if (userFeedback.length === 1 && !hasAchievement(AchievementType.FEEDBACK_PROVIDER)) {
             newlyUnlocked.push(createAchievement(AchievementType.FEEDBACK_PROVIDER));
        }
    }
    
    // Filter out achievements that were already unlocked in this run
    newlyUnlocked = newlyUnlocked.filter(newAch => !currentAchievements.some(currAch => currAch.type === newAch.type));

    const finalAchievements = [...currentAchievements, ...newlyUnlocked];
    const newNotifications = newlyUnlocked.map(ach => createNotification(userId, ach));

    return { finalAchievements, newNotifications };
};
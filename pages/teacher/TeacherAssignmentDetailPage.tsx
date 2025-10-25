import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Submission, Report, User } from '../../types';
import ReportDetailModal from '../../components/ui/ReportDetailModal';
import { analyzeContent } from '../../services/geminiService';
import { ArrowLeftIcon, DocumentMagnifyingGlassIcon, EyeIcon, DocumentTextIcon, DocumentIcon, ArrowUpIcon, ArrowDownIcon, ArrowsUpDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import SubmissionViewModal from '../../components/ui/SubmissionViewModal';
import Card from '../../components/ui/Card';

const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return <DocumentTextIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" aria-label="PDF file" />;
        case 'docx':
            return <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" aria-label="Word document" />;
        case 'txt':
            return <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" aria-label="Text file" />;
        default:
            return <DocumentIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" aria-label="File" />;
    }
};


const TeacherAssignmentDetailPage: React.FC = () => {
    const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>();
    const { state, dispatch } = useData();

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
    const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);

    const [filterStatus, setFilterStatus] = useState<'ALL' | 'Submitted' | 'Analyzed' | 'Published' | 'Not Submitted'>('ALL');
    type SortKey = 'name' | 'date' | 'status';
    type SortDirection = 'ascending' | 'descending';
    const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: SortDirection }>({ key: 'name', direction: 'ascending' });


    const currentClass = state.classes.find(c => c.id === classId);
    const currentAssignment = state.assignments.find(a => a.id === assignmentId);
    
    if (!currentClass || !currentAssignment) {
        return <div>Assignment or Class not found.</div>;
    }

    const submissions = state.submissions.filter(s => s.assignmentId === currentAssignment.id);
    const students = state.users.filter(u => currentClass.studentIds.includes(u.id));
    
    const getSubmissionStatus = (studentId: string) => {
        const submission = submissions.find(s => s.studentId === studentId);
        if (!submission) return { text: 'Not Submitted' as const, color: 'text-gray-500', submission: null, report: null };
        
        const report = state.reports.find(r => r.id === submission.reportId);
        if (report?.status === 'PUBLISHED') return { text: 'Published' as const, color: 'text-green-600', submission, report };
        if (report) return { text: 'Analyzed' as const, color: 'text-amber-600', submission, report };
        
        return { text: 'Submitted' as const, color: 'text-blue-600', submission, report: null };
    };
    
    const displayedStudents = useMemo(() => {
        const filtered = students.filter(student => {
            if (filterStatus === 'ALL') return true;
            const { text } = getSubmissionStatus(student.id);
            return text === filterStatus;
        });

        return filtered.sort((a, b) => {
            const statusA = getSubmissionStatus(a.id);
            const statusB = getSubmissionStatus(b.id);
            
            let compare = 0;
            switch (sortConfig.key) {
                case 'name':
                    compare = a.name.localeCompare(b.name);
                    break;
                case 'date':
                    if (!statusA.submission) compare = 1;
                    else if (!statusB.submission) compare = -1;
                    else compare = new Date(statusA.submission.submittedAt).getTime() - new Date(statusB.submission.submittedAt).getTime();
                    break;
                case 'status':
                    const order = { 'Published': 1, 'Analyzed': 2, 'Submitted': 3, 'Not Submitted': 4 };
                    compare = order[statusA.text] - order[statusB.text];
                    break;
            }
            return sortConfig.direction === 'ascending' ? compare : -compare;
        });
    }, [students, submissions, state.reports, filterStatus, sortConfig]);

    const runAnalysis = async (submissionToAnalyze: Submission) => {
        setAnalyzingIds(prev => [...prev, submissionToAnalyze.id]);
        
        const otherSubmissions = state.submissions
            .filter(s => s.assignmentId === currentAssignment.id && s.id !== submissionToAnalyze.id)
            .map(s => {
                const student = state.users.find(u => u.id === s.studentId);
                return {
                    studentName: student?.name || 'Unknown Student',
                    fileContent: s.fileContent,
                };
            });

        try {
            const result = await analyzeContent(submissionToAnalyze.fileContent, otherSubmissions);
            const newReport: Report = {
                id: `report-${Date.now()}`,
                submissionId: submissionToAnalyze.id,
                ...result,
                status: 'PENDING',
                generatedAt: new Date().toISOString()
            };
            dispatch({ type: 'ADD_REPORT', payload: { submissionId: submissionToAnalyze.id, report: newReport } });
        } catch (error) {
            console.error(`Analysis failed for ${submissionToAnalyze.fileName}:`, error);
            throw error;
        } finally {
            setAnalyzingIds(prev => prev.filter(id => id !== submissionToAnalyze.id));
        }
    };

    const handleAnalyze = async (submission: Submission) => {
        try {
            await runAnalysis(submission);
        } catch (e) {
            alert(`Analysis failed for ${submission.fileName}.`);
        }
    };

    const handlePublish = (reportId: string, studentId: string) => {
        dispatch({ type: 'PUBLISH_REPORT', payload: { reportId, studentId } });
        setSelectedReport(prev => prev && prev.id === reportId ? { ...prev, status: 'PUBLISHED' } : prev);
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const displayedSubmittedIds = displayedStudents
            .filter(student => submissions.some(s => s.studentId === student.id))
            .map(student => student.id);

        if (e.target.checked) {
            setSelectedStudentIds(prev => [...new Set([...prev, ...displayedSubmittedIds])]);
        } else {
            setSelectedStudentIds(prev => prev.filter(id => !displayedSubmittedIds.includes(id)));
        }
    };

    const handleSelectSingle = (e: React.ChangeEvent<HTMLInputElement>, studentId: string) => {
        if (e.target.checked) {
            setSelectedStudentIds(prev => [...prev, studentId]);
        } else {
            setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
        }
    };
    
    const { selectedData, canAnalyzeSelected, canPublishSelected } = useMemo(() => {
        const data = selectedStudentIds.map(studentId => {
            const submission = submissions.find(s => s.studentId === studentId);
            const report = submission ? state.reports.find(r => r.id === submission.reportId) : null;
            return { submission, report, studentId };
        });
        
        const analyze = data.some(item => item.submission && !item.report);
        const publish = data.some(item => item.report && item.report.status === 'PENDING');
        
        return { selectedData: data, canAnalyzeSelected: analyze, canPublishSelected: publish };
    }, [selectedStudentIds, submissions, state.reports]);


    const handleBatchAnalyze = async () => {
        // Filter for submissions that have been submitted but not yet analyzed.
        const submissionsToAnalyze = selectedData
            .filter(item => item.submission && !item.report)
            .map(item => item.submission as Submission);
        
        if (submissionsToAnalyze.length === 0) {
            alert("No new submissions selected for analysis.");
            return;
        }
    
        if (!window.confirm(`Are you sure you want to analyze ${submissionsToAnalyze.length} submission(s)?`)) return;
    
        setIsBatchAnalyzing(true);
        
        const results = await Promise.allSettled(submissionsToAnalyze.map(sub => runAnalysis(sub)));
        const successfulCount = results.filter(r => r.status === 'fulfilled').length;
        const failedCount = submissionsToAnalyze.length - successfulCount;
    
        let summaryMessage = `Batch analysis complete: ${successfulCount} succeeded.`;
        if (failedCount > 0) {
            summaryMessage += ` ${failedCount} failed.`;
        }
        alert(summaryMessage);
        
        setIsBatchAnalyzing(false);
        setSelectedStudentIds([]);
    };

    const handleBatchPublish = () => {
        // Filter for reports that are analyzed but not yet published.
        const reportsToPublish = selectedData
            .filter(item => item.report && item.report.status === 'PENDING');
        
        if (reportsToPublish.length === 0) {
            alert("No pending reports selected for publishing.");
            return;
        }
        
        if (!window.confirm(`Are you sure you want to publish ${reportsToPublish.length} report(s) to students?`)) return;
    
        reportsToPublish.forEach(({ report, studentId }) => {
            // The filter above ensures report is not null
            handlePublish(report!.id, studentId);
        });
    
        alert(`${reportsToPublish.length} report(s) have been successfully published.`);
        setSelectedStudentIds([]);
    };
    
    const getSubmissionForReport = (report: Report | null) => {
        if (!report) return null;
        return state.submissions.find(s => s.id === report.submissionId) || null;
    }
    
    const getStudentForReport = (report: Report | null) => {
        const submission = getSubmissionForReport(report);
        if (!submission) return null;
        return state.users.find(u => u.id === submission.studentId) || null;
    }
    
    const getStudentForSubmission = (submission: Submission | null): User | null => {
        if (!submission) return null;
        return state.users.find(u => u.id === submission.studentId) || null;
    }

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ sortKey: SortKey }> = ({ sortKey }) => {
        if (sortConfig.key !== sortKey) {
            return <ArrowsUpDownIcon className="w-4 h-4 ml-2 text-gray-400" />;
        }
        return sortConfig.direction === 'ascending' ? 
            <ArrowUpIcon className="w-4 h-4 ml-2 text-gray-800" /> : 
            <ArrowDownIcon className="w-4 h-4 ml-2 text-gray-800" />;
    };

    const handleExportCsv = () => {
        const headers = ['Student Name', 'Submission File', 'Submitted On', 'Status'];
        
        const rows = displayedStudents.map(student => {
            const { text, submission } = getSubmissionStatus(student.id);
            const studentName = student.name;
            const fileName = submission ? submission.fileName : 'N/A';
            const submittedDate = submission ? new Date(submission.submittedAt).toLocaleString() : 'N/A';
            const status = text;

            // Simple CSV escaping: wrap fields in double quotes and double up existing double quotes.
            const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;

            return [escape(studentName), escape(fileName), escape(submittedDate), escape(status)].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentAssignment.title.replace(/\s+/g, '_')}_submissions.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const displayedSubmittedStudents = displayedStudents.filter(student => submissions.some(s => s.studentId === student.id));

    return (
        <div>
            <Link to={`/dashboard/classes/${classId}`} className="flex items-center text-sm text-blue-600 hover:underline mb-4 font-semibold">
                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                Back to {currentClass.name}
            </Link>
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{currentAssignment.title}</h1>
                <p className="text-gray-600 mt-1">{currentAssignment.instructions}</p>
                <p className="text-sm text-gray-500 mt-2">Due: {new Date(currentAssignment.deadline).toLocaleString()}</p>
            </div>
            
            {selectedStudentIds.length > 0 && (
                 <div className="sticky top-4 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg mb-6 flex justify-between items-center animation-fadeIn">
                    <p className="font-semibold text-gray-700">{selectedStudentIds.length} selected</p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleBatchAnalyze}
                            disabled={!canAnalyzeSelected || isBatchAnalyzing}
                            className="flex items-center text-sm bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm w-32 justify-center"
                        >
                             {isBatchAnalyzing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" />
                                    Analyze
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBatchPublish}
                            disabled={!canPublishSelected}
                            className="flex items-center text-sm bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                        >
                            <EyeIcon className="w-5 h-5 mr-2" />
                            Publish
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex justify-end items-center mb-4 gap-4">
                 <button 
                    onClick={handleExportCsv}
                    className="flex items-center text-sm bg-white border border-gray-300 text-gray-700 font-semibold px-3 py-2 rounded-md hover:bg-gray-50 transition shadow-sm"
                >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export CSV
                </button>
                <div>
                    <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                    <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Analyzed">Analyzed</option>
                        <option value="Published">Published</option>
                        <option value="Not Submitted">Not Submitted</option>
                    </select>
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={handleSelectAll}
                                            checked={displayedSubmittedStudents.length > 0 && displayedSubmittedStudents.every(s => selectedStudentIds.includes(s.id))}
                                            ref={input => {
                                                if (input) {
                                                    const selectedInView = displayedSubmittedStudents.filter(s => selectedStudentIds.includes(s.id)).length;
                                                    input.indeterminate = selectedInView > 0 && selectedInView < displayedSubmittedStudents.length;
                                                }
                                            }}
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    <button onClick={() => requestSort('name')} className="flex items-center uppercase">
                                        Student <SortIcon sortKey="name" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold uppercase">Submission</th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    <button onClick={() => requestSort('date')} className="flex items-center uppercase">
                                        Submitted On <SortIcon sortKey="date" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    <button onClick={() => requestSort('status')} className="flex items-center uppercase">
                                        Status <SortIcon sortKey="status" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedStudents.map(student => {
                                const { text, color, submission, report } = getSubmissionStatus(student.id);
                                const isAnalyzing = submission ? analyzingIds.includes(submission.id) : false;
                                return (
                                    <tr key={student.id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isAnalyzing ? 'bg-blue-100 opacity-50 cursor-not-allowed' : ''}`}>
                                        <td className="w-4 p-4">
                                            {submission && (
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={selectedStudentIds.includes(student.id)}
                                                        onChange={(e) => handleSelectSingle(e, student.id)}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4">
                                            {submission ? (
                                                <div className="flex items-center text-gray-700">
                                                    {getFileTypeIcon(submission.fileName)}
                                                    <span className="truncate" title={submission.fileName}>{submission.fileName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">{submission ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">
                                            {isAnalyzing ? (
                                                <div className="flex items-center text-blue-600">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Analyzing...</span>
                                                </div>
                                            ) : (
                                                <span className={color}>{text}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            {submission && (
                                                <>
                                                    <button onClick={() => setViewingSubmission(submission)} disabled={isAnalyzing} className="flex items-center text-sm text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" title="View Submission Content">
                                                        <DocumentTextIcon className="w-5 h-5 mr-1"/> View
                                                    </button>
                                                    {!report ? (
                                                        <button onClick={() => handleAnalyze(submission)} disabled={isAnalyzing} className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed" title="Analyze Submission">
                                                            <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-1"/> Analyze
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => setSelectedReport(report)} disabled={isAnalyzing} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed" title="View Analysis Report">
                                                            <EyeIcon className="w-5 h-5 mr-1"/> Report
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                 {displayedStudents.length === 0 ? <p className="text-center text-gray-500 py-8">No submissions match the current filter.</p> : null}
            </Card>

            <ReportDetailModal
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                onPublish={handlePublish}
                report={selectedReport}
                submission={getSubmissionForReport(selectedReport)}
                student={getStudentForReport(selectedReport)}
            />

            <SubmissionViewModal
                isOpen={!!viewingSubmission}
                onClose={() => setViewingSubmission(null)}
                submission={viewingSubmission}
                student={getStudentForSubmission(viewingSubmission)}
            />
        </div>
    )
};

export default TeacherAssignmentDetailPage;
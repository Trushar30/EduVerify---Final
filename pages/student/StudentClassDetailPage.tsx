import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Submission, Report } from '../../types';
import Card from '../../components/ui/Card';
import DoughnutChart from '../../components/ui/DoughnutChart';
import { ArrowLeftIcon, SparklesIcon, DocumentTextIcon, UsersIcon, BellIcon, UserCircleIcon, LinkIcon, DocumentIcon, XCircleIcon, ArrowUpTrayIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Helper function to read file content based on file type
const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (file.type === 'application/pdf') {
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let textContent = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const text = await page.getTextContent();
                        textContent += text.items.map((item: { str: string }) => item.str).join(' ') + '\n';
                    }
                    resolve(textContent);
                } catch (error) {
                    console.error('PDF parsing error:', error);
                    reject('Failed to parse PDF file. The file might be corrupted or protected.');
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
                    resolve(result.value);
                } catch (error) {
                    console.error('DOCX parsing error:', error);
                    reject('Failed to parse Word file. The file might be corrupted.');
                }
            };
            reader.readAsArrayBuffer(file);
        } else { // Assume plain text for .txt and other files
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.readAsText(file);
        }

        reader.onerror = () => {
            reject('Failed to read file.');
        };
    });
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // result is "data:mime/type;base64,..."
            // We only need the part after the comma.
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const formatFileSize = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return <DocumentTextIcon className="w-6 h-6 text-red-500 flex-shrink-0" aria-label="PDF file" />;
        case 'docx':
            return <DocumentTextIcon className="w-6 h-6 text-blue-600 flex-shrink-0" aria-label="Word document" />;
        case 'txt':
            return <DocumentTextIcon className="w-6 h-6 text-gray-500 flex-shrink-0" aria-label="Text file" />;
        default:
            return <DocumentIcon className="w-6 h-6 text-gray-400 flex-shrink-0" aria-label="File" />;
    }
};


const StudentClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { user } = useAuth();
    const { state, dispatch } = useData();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'stream' | 'assignments' | 'people'>('assignments');
    
    // States for submission and feedback forms, keyed by assignment ID
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
    const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string | null }>({});
    const [feedbackMessages, setFeedbackMessages] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [dragOverStates, setDragOverStates] = useState<{ [key: string]: boolean }>({});
    const [submissionStatusText, setSubmissionStatusText] = useState<{ [key: string]: string }>({});

    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const currentClass = state.classes.find(c => c.id === classId);

    if (!user || !currentClass) return <div>Error loading class details.</div>;
    
    const handleFileAccepted = (file: File, assignmentId: string) => {
        const allowedExtensions = ['.pdf', '.docx', '.txt'];
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

        if (allowedExtensions.includes(fileExtension)) {
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: file }));
            setUploadErrors(prev => ({ ...prev, [assignmentId]: null }));
        } else {
            setUploadErrors(prev => ({ ...prev, [assignmentId]: 'Invalid file type. Please upload a .pdf, .docx, or .txt file.' }));
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));
            if (fileInputRefs.current[assignmentId]) {
                fileInputRefs.current[assignmentId]!.value = "";
            }
        }
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
        if (event.target.files && event.target.files[0]) {
            handleFileAccepted(event.target.files[0], assignmentId);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, assignmentId: string) => {
        e.preventDefault();
        setDragOverStates(prev => ({ ...prev, [assignmentId]: true }));
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, assignmentId: string) => {
        e.preventDefault();
        setDragOverStates(prev => ({ ...prev, [assignmentId]: false }));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // This is necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, assignmentId: string) => {
        e.preventDefault();
        setDragOverStates(prev => ({ ...prev, [assignmentId]: false }));
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileAccepted(e.dataTransfer.files[0], assignmentId);
        }
    };


    const handleRemoveFile = (assignmentId: string) => {
        setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));
        if (fileInputRefs.current[assignmentId]) {
            fileInputRefs.current[assignmentId]!.value = "";
        }
    };
    
    const handleSubmit = async (assignmentId: string) => {
        const selectedFile = selectedFiles[assignmentId];
        if (!selectedFile) return;

        setIsSubmitting(prev => ({ ...prev, [assignmentId]: true }));
        setUploadProgress(prev => ({ ...prev, [assignmentId]: 0 }));
        setSubmissionStatusText(prev => ({ ...prev, [assignmentId]: 'Verifying file...' }));


        // Simulate progress and status updates
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                const currentProgress = prev[assignmentId] || 0;
                if (currentProgress >= 95) {
                    clearInterval(progressInterval);
                    return { ...prev, [assignmentId]: 95 };
                }
                return { ...prev, [assignmentId]: currentProgress + Math.floor(Math.random() * 10) + 5 };
            });
        }, 200);

        const statuses = ["Preparing submission...", "Sending to EduVerify...", "Finalizing..."];
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            if (statusIndex < statuses.length) {
                setSubmissionStatusText(prev => ({ ...prev, [assignmentId]: statuses[statusIndex] }));
                statusIndex++;
            } else {
                clearInterval(statusInterval);
            }
        }, 600);


        try {
            const [fileContent, fileData] = await Promise.all([
                readFileContent(selectedFile),
                fileToBase64(selectedFile)
            ]);
            
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            setUploadProgress(prev => ({ ...prev, [assignmentId]: 100 }));
            setSubmissionStatusText(prev => ({ ...prev, [assignmentId]: "Complete!" }));


            const newSubmission: Submission = {
                id: `sub-${Date.now()}`,
                assignmentId,
                studentId: user.id,
                fileName: selectedFile.name,
                fileContent: fileContent,
                fileData: fileData,
                mimeType: selectedFile.type || 'application/octet-stream',
                submittedAt: new Date().toISOString(),
            };

            // Short delay to show 100% completion before UI changes
            setTimeout(() => {
                dispatch({ type: 'ADD_SUBMISSION', payload: newSubmission });
                addToast('Submission successful!', 'success');
                setIsSubmitting(prev => ({...prev, [assignmentId]: false}));
            }, 500);

        } catch (error) {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            console.error("Error processing submission:", error);
            addToast(`${error}`, 'error');
            setIsSubmitting(prev => ({ ...prev, [assignmentId]: false }));
            setUploadProgress(prev => ({ ...prev, [assignmentId]: 0 }));
            setSubmissionStatusText(prev => ({ ...prev, [assignmentId]: '' }));
        }
    };

    const handleFeedbackSubmit = (reportId: string) => {
        const feedbackMessage = feedbackMessages[reportId];
        if (!feedbackMessage || !feedbackMessage.trim()) return;
        dispatch({
            type: 'ADD_FEEDBACK',
            payload: {
                reportId,
                studentId: user.id,
                teacherId: currentClass.teacherId,
                message: feedbackMessage,
            }
        });
        addToast('Feedback sent successfully!', 'success');
        setFeedbackMessages(prev => ({ ...prev, [reportId]: '' }));
    };

    const renderStream = () => {
        const classNotifications = state.notifications
            .filter(n => n.userId === user.id && (n.message.includes(`in ${currentClass.name}`) || state.reports.find(r => r.id === state.submissions.find(s=> s.studentId === user.id && s.reportId === r.id)?.reportId)))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
             <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Class Stream</h2>
                {classNotifications.length > 0 ? (
                    <div className="space-y-4">
                        {classNotifications.map(item => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 border border-gray-200">
                                <BellIcon className="w-6 h-6 text-blue-500 flex-shrink-0"/>
                                <div>
                                    <p className="text-gray-700">{item.message}</p>
                                    <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500 text-center py-8">No new updates for this class.</p>}
            </Card>
        );
    };

    const renderAssignments = () => {
        const assignments = state.assignments.filter(a => a.classId === currentClass.id);
         return (
            <div>
                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Assignments</h2>
                {assignments.length > 0 ? (
                    <div className="space-y-6">
                        {assignments.map(a => {
                            const submission = state.submissions.find(s => s.assignmentId === a.id && s.studentId === user.id);
                            const report = submission?.reportId ? state.reports.find(r => r.id === submission.reportId) : undefined;
                            const isPastDeadline = new Date() > new Date(a.deadline);
                            const uploadError = uploadErrors[a.id];

                            const isCurrentlySubmitting = isSubmitting[a.id];
                            const progress = uploadProgress[a.id] || 0;
                            const selectedFile = selectedFiles[a.id];
                            const isDraggingOver = dragOverStates[a.id];

                            return (
                                <Card key={a.id} className="!p-0 overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg text-blue-600">{a.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{a.instructions}</p>
                                        <p className={`text-xs mt-2 ${isPastDeadline && !submission ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                            Deadline: {new Date(a.deadline).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                        {!submission ? (
                                            isPastDeadline ? <p className="text-red-500 font-semibold">Deadline has passed.</p> :
                                            isCurrentlySubmitting ? (
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">Submitting: <span className="font-normal">{selectedFile?.name}</span></p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s ease-in-out' }}></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>{submissionStatusText[a.id] || 'Starting...'}</span>
                                                        <span>{Math.round(progress)}%</span>
                                                    </div>
                                                </div>
                                            ) : selectedFile ? (
                                                <div>
                                                    <div className="flex items-center justify-between p-2 bg-white border border-gray-300 rounded-lg">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            {getFileTypeIcon(selectedFile.name)}
                                                            <div className="overflow-hidden">
                                                                <p className="text-sm font-semibold text-gray-800 truncate">{selectedFile.name}</p>
                                                                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleRemoveFile(a.id)} aria-label="Remove file">
                                                            <XCircleIcon className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" />
                                                        </button>
                                                    </div>
                                                    <button onClick={() => handleSubmit(a.id)} className="w-full mt-3 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-blue-700 transition shadow-sm">
                                                        Submit Assignment
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div
                                                        onDragEnter={(e) => handleDragEnter(e, a.id)}
                                                        onDragLeave={(e) => handleDragLeave(e, a.id)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, a.id)}
                                                        onClick={() => fileInputRefs.current[a.id]?.click()}
                                                        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-100'}`}
                                                    >
                                                        <input
                                                            id={`file-upload-${a.id}`}
                                                            type="file"
                                                            className="sr-only"
                                                            ref={el => fileInputRefs.current[a.id] = el}
                                                            onChange={(e) => handleFileChange(e, a.id)}
                                                            accept=".txt,.pdf,.docx"
                                                        />
                                                        <ArrowUpTrayIcon className={`w-8 h-8 mb-2 ${isDraggingOver ? 'text-blue-600' : 'text-gray-400'}`} />
                                                        <p className="text-sm font-semibold text-gray-700">
                                                            <span className="text-blue-600">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PDF, DOCX, or TXT</p>
                                                    </div>
                                                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                                                </div>
                                            )
                                        ) : (
                                            <div>
                                                <p className="text-green-600 text-sm font-semibold">Submitted: {submission.fileName}</p>

                                                {submission.teacherFeedback && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <h4 className="font-semibold text-lg mb-2 text-gray-800 flex items-center">
                                                            <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-indigo-500" />
                                                            Teacher's Feedback
                                                        </h4>
                                                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                                            <p className="text-gray-700 whitespace-pre-wrap">{submission.teacherFeedback}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {report?.status === 'PUBLISHED' ? (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <h4 className="font-semibold text-lg mb-4 text-gray-800">Your Report</h4>
                                                        <div className="flex flex-col md:flex-row justify-around items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                            <DoughnutChart score={report.plagiarismScore} title="Plagiarism" color="#ef4444" />
                                                            <DoughnutChart score={report.aiContentScore} title="AI Content" color="#3b82f6" />
                                                        </div>
                                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Analysis Summary:</span> {report.analysisSummary}</p>
                                                            {report.plagiarizedSources.length > 0 &&
                                                                <div className="mt-4">
                                                                    <p className="font-semibold text-sm text-gray-800 mb-2">Flagged Sources:</p>
                                                                    <ul className="space-y-2">
                                                                        {report.plagiarizedSources.map((source, i) => 
                                                                        <li key={i} className="text-sm text-gray-500 border-l-2 border-gray-300 pl-3">
                                                                            <p className="italic text-gray-600 mb-1">"{source.snippet}"</p>
                                                                            <a href={source.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                                                                                <LinkIcon className="w-3 h-3 mr-1"/>
                                                                                Source ({source.confidence}% confidence)
                                                                            </a>
                                                                        </li>)}
                                                                    </ul>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="mt-4">
                                                            <h5 className="font-semibold mb-2 text-gray-800">Provide Feedback</h5>
                                                            <textarea value={feedbackMessages[report.id] || ''} onChange={e => setFeedbackMessages(prev => ({ ...prev, [report.id]: e.target.value }))} rows={3} placeholder="Ask a question or leave a comment..." className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                                                            <button onClick={() => handleFeedbackSubmit(report.id)} className="mt-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition shadow-sm">Send Feedback</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-amber-600 mt-2">Your submission is awaiting a report from your teacher.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : <p className="text-gray-500 text-center py-8">No assignments posted for this class yet.</p>}
            </div>
         );
    };

    const renderPeople = () => {
        const teacher = state.users.find(u => u.id === currentClass.teacherId);
        const classmates = state.users.filter(u => currentClass.studentIds.includes(u.id));
        return (
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Teacher</h2>
                {teacher && (
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-4 mb-6 border border-gray-200">
                        <UserCircleIcon className="w-8 h-8 text-blue-500"/>
                        <div>
                            <p className="font-semibold text-gray-800">{teacher.name}</p>
                            <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                    </div>
                )}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Classmates ({classmates.length})</h2>
                <ul className="space-y-3">
                    {classmates.map(student => (
                        <li key={student.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-4 border border-gray-200">
                            <UserCircleIcon className="w-8 h-8 text-gray-400"/>
                            <p className="text-gray-700">{student.name}</p>
                        </li>
                    ))}
                </ul>
            </Card>
        );
    }

    const tabs = [
        { id: 'stream', name: 'Stream', icon: SparklesIcon },
        { id: 'assignments', name: 'Assignments', icon: DocumentTextIcon },
        { id: 'people', name: 'People', icon: UsersIcon },
    ];

    return (
        <div>
            <Link to="/dashboard/classes" className="flex items-center text-sm text-blue-600 hover:underline mb-4 font-semibold">
                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                Back to My Classes
            </Link>
             <div className={`p-6 rounded-lg mb-6 bg-white border border-gray-200 border-t-4 ${currentClass.classTheme}`}>
                <h1 className="text-3xl font-bold text-gray-900">{currentClass.name}</h1>
            </div>

            <div className="mb-6">
                 <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                            }
                        >
                        <tab.icon className="w-5 h-5 mr-2"/>
                        {tab.name}
                        </button>
                    ))}
                    </nav>
                </div>
            </div>

            <div className="mt-4">
                {activeTab === 'stream' && renderStream()}
                {activeTab === 'assignments' && renderAssignments()}
                {activeTab === 'people' && renderPeople()}
            </div>
        </div>
    );
};

export default StudentClassDetailPage;
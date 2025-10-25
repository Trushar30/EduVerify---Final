import React, { useRef } from 'react';
import { Report, Submission, User } from '../../types';
import Modal from './Modal';
import DoughnutChart from './DoughnutChart';
import { LinkIcon, SparklesIcon, UsersIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ReportDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (reportId: string, studentId: string) => void;
    report: Report | null;
    submission: Submission | null;
    student: User | null;
}

declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

const getScoreCategory = (score: number): { label: string; color: string; chartColor: string } => {
    if (score <= 20) {
        return { label: 'Low Risk', color: 'text-green-600', chartColor: '#22c55e' };
    }
    if (score <= 50) {
        return { label: 'Moderate Concern', color: 'text-amber-600', chartColor: '#f59e0b' };
    }
    return { label: 'High Concern', color: 'text-red-600', chartColor: '#ef4444' };
};

const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-red-100 text-red-700';
    if (confidence >= 70) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-600';
}

const ScoreIndicator: React.FC<{ score: number; title: string }> = ({ score, title }) => {
    const { label, color, chartColor } = getScoreCategory(score);
    return (
        <div className="flex flex-col items-center gap-2">
            <DoughnutChart score={score} title={title} color={chartColor} />
            <p className={`font-semibold ${color}`}>{label}</p>
        </div>
    );
};


const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ isOpen, onClose, onPublish, report, submission, student }) => {
    const reportContentRef = useRef<HTMLDivElement>(null);

    const handleExportPdf = () => {
        if (!reportContentRef.current || !student || !submission || !window.html2canvas || !window.jspdf) {
            alert('PDF generation library not loaded or required data is missing.');
            return;
        }

        const reportElement = reportContentRef.current;
        const { jsPDF } = window.jspdf;

        window.html2canvas(reportElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
        }).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });
            
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;
            
            const ratio = imgWidth / imgHeight;
            const width = pdfWidth;
            const height = width / ratio;
    
            let position = 0;
            let heightLeft = height;
    
            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            heightLeft -= pdfHeight;
    
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, width, height);
                heightLeft -= pdfHeight;
            }
    
            pdf.save(`Report-${student.name}-${submission.fileName.split('.')[0]}.pdf`);
        }).catch((err: Error) => {
            console.error("Error generating PDF:", err);
            alert("Sorry, there was an error generating the PDF.");
        });
    };

    if (!isOpen || !report || !submission || !student) return null;

    const keyPoints = report.analysisSummary
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Analysis Report for ${student.name}`} maxWidth="max-w-2xl">
            <div ref={reportContentRef}>
                <div className="space-y-6 p-1"> {/* Added padding for better PDF capture */}
                    <p className="text-sm text-gray-500">
                        Submission: <span className="font-semibold text-gray-700">{submission.fileName}</span>
                    </p>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Score Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <ScoreIndicator score={report.plagiarismScore} title="Plagiarism Score" />
                           <ScoreIndicator score={report.aiContentScore} title="AI Content Likelihood" />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
                        <div>
                            <h4 className="font-semibold text-blue-600 mb-2">AI Summary & Findings</h4>
                            <ul className="space-y-2">
                                {keyPoints.map((point, index) => (
                                    <li key={index} className="flex items-start text-sm text-gray-600">
                                        <SparklesIcon className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-blue-500" />
                                        <span>{point}.</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {report.plagiarizedSources.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-blue-600 mb-3 pt-4 border-t border-gray-200">Flagged Sources</h4>
                                <ul className="space-y-3">
                                    {report.plagiarizedSources.map((sourceItem, i) => (
                                        <li key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 text-sm mb-3">
                                                "{sourceItem.snippet}"
                                            </blockquote>
                                            <div className="flex justify-between items-center">
                                                {sourceItem.sourceType === 'INTERNAL' ? (
                                                    <div className="flex items-center text-sm text-amber-700">
                                                        <UsersIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                                        <span className="font-medium">Internal Match: <span className="font-bold text-gray-800">{sourceItem.studentName || sourceItem.source}</span></span>
                                                    </div>
                                                ) : (
                                                    <a 
                                                        href={sourceItem.source.startsWith('http') ? sourceItem.source : `https://${sourceItem.source}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="flex items-center text-xs text-gray-500 hover:text-blue-600 hover:underline truncate pr-4"
                                                    >
                                                        <LinkIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                        <span className="truncate">{sourceItem.source}</span>
                                                    </a>
                                                )}
                                                 <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getConfidenceColor(sourceItem.confidence)}`}>
                                                    {sourceItem.confidence}% Confidence
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-5">
                <button 
                    onClick={handleExportPdf}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm text-sm font-semibold"
                >
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Export PDF
                </button>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">Close</button>
                    {report.status === 'PENDING' && (
                        <button onClick={() => onPublish(report.id, student.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 shadow-sm">Publish Report</button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ReportDetailModal;

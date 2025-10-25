import React, { useState, useEffect } from 'react';
import { Submission, User } from '../../types';
import Modal from './Modal';

// Helper to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

const FilePreviewer: React.FC<{ submission: Submission }> = ({ submission }) => {
    const { mimeType, fileData, fileContent, fileName } = submission;
    const [docHtml, setDocHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && fileData) {
            setIsLoading(true);
            setError('');
            try {
                const arrayBuffer = base64ToArrayBuffer(fileData);
                (window as any).mammoth.convertToHtml({ arrayBuffer })
                    .then((result: { value: string }) => {
                        setDocHtml(result.value);
                        setIsLoading(false);
                    })
                    .catch((err: Error) => {
                        console.error("Error converting DOCX to HTML:", err);
                        setError('Could not render the Word document preview.');
                        setIsLoading(false);
                    });
            } catch (err) {
                setError('Could not process the Word document file.');
                setIsLoading(false);
            }
        }
    }, [mimeType, fileData]);

    if (!fileData || !mimeType) {
        // Fallback for old data or if file data is missing, render as plain text
        return (
            <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap font-sans max-h-[60vh] overflow-y-auto border border-gray-200">
                {fileContent}
            </pre>
        );
    }

    switch (mimeType) {
        case 'application/pdf':
            return (
                <iframe
                    src={`data:application/pdf;base64,${fileData}`}
                    className="w-full h-[60vh] rounded-lg border border-gray-300"
                    title={fileName}
                />
            );
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            if (isLoading) return <p className="text-center p-8 text-gray-500">Loading Word document preview...</p>;
            if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
            return (
                <div
                    className="p-4 bg-white border border-gray-200 rounded-lg h-[60vh] overflow-y-auto prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: docHtml }}
                />
            );
        case 'text/plain':
        default:
            return (
                <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap font-sans max-h-[60vh] overflow-y-auto border border-gray-200">
                    {fileContent}
                </pre>
            );
    }
};

interface SubmissionViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Submission | null;
    student: User | null;
}

const SubmissionViewModal: React.FC<SubmissionViewModalProps> = ({ isOpen, onClose, submission, student }) => {
    if (!isOpen || !submission || !student) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Submission by ${student.name}`} maxWidth="max-w-3xl">
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-blue-600">File Name</h3>
                    <p className="text-gray-700">{submission.fileName}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-blue-600">Submitted On</h3>
                    <p className="text-gray-700">{new Date(submission.submittedAt).toLocaleString()}</p>
                </div>
                <div className="pt-4">
                    <h3 className="font-semibold text-blue-600 mb-2">Content Preview</h3>
                    <FilePreviewer submission={submission} />
                </div>
                <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm">
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SubmissionViewModal;
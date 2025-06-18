import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import ChatbotWidget from './chatbot/chatbot';
import axios from "../Axios/axios.js";

function App() {
    const [documentType, setDocumentType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage(null);

        if (!documentType || !selectedFile) {
            setErrorMessage(["Please select a document type and upload a file."]);
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('documentType', documentType);
        formData.append('file', selectedFile);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }


        try {
            const response = await axios.post('/processDocs/validate', formData);
            console.log(response.data.message)
            console.log(response.request.status)

            if (response.request.status === 200) {

                if (response.data.isValid === "valid") {
                    setSuccessMessage(`${response.data.ocrResult.name}, your ${response.data.ocrResult.document_type} is valid till ${response.data.ocrResult.expiration_date}`);
                } else {

                    setErrorMessage(response.data.message || ["Validation failed with no specific issues."]);
                }
            } else {

                setErrorMessage(response.data.message || [`Server error: ${response.status} ${response.statusText}`]);
            }
        } catch (error) {
            // Catch network errors or other unexpected issues during the fetch operation
            setErrorMessage(["Network error or unexpected issue. Please try again."]);
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4 font-inter">
            {/* Card-like container for the form */}
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Document Validation</h2>

                {/* Success Alert Message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-200 shadow-sm flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Error Alert Message */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 shadow-sm">
                        <h3 className="font-semibold flex items-center mb-1">
                            <XCircle className="w-5 h-5 mr-2" />
                            Validation Issues:
                        </h3>
                        {/* List of issues */}
                        <ul className="list-disc pl-5">
                            {/* Ensure errorMessage is an array before mapping */}
                            {Array.isArray(errorMessage) ? errorMessage.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            )) : <li>{errorMessage}</li>} {/* Handle case where errorMessage is a single string */}
                        </ul>
                    </div>
                )}

                {/* Document Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Document Type Dropdown */}
                    <div>
                        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                            Document Type
                        </label>
                        <select
                            id="documentType"
                            name="documentType"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)} // Update state on change
                        >
                            <option value="">Select a document type</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                        </select>
                    </div>

                    {/* File Upload Input Area */}
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Document (JPEG/PNG)
                        </label>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".jpeg,.jpg,.png"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            {selectedFile ? selectedFile.name : 'No file chosen'}
                        </p>
                    </div>
                    {/* Submit Button with Loading Spinner */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            // Replaced SVG spinner with Lucide Loader2 icon and applied Tailwind animation
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        ) : null}
                        {/* Button text changes based on loading state */}
                        {loading ? 'Validating...' : 'Validate Document'}
                    </button>
                </form>
            </div>
            <ChatbotWidget />
        </div>
    );
}

export default App;

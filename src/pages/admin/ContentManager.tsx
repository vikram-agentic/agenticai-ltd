import React, { useState } from 'react';

const ContentManager = () => {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateContent = async () => {
    setIsLoading(true);
    const response = await fetch('/api/content-generator-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    setGeneratedContent(data.contentData);
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800">Content Manager</h1>
      <div className="mt-4">
        <label htmlFor="topic" className="block text-gray-700 text-sm font-bold mb-2">
          Topic
        </label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleGenerateContent}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Generated Content</h2>
          <div className="mt-4 bg-white p-4 rounded-md">
            <h3 className="text-xl font-semibold">{generatedContent.title}</h3>
            <p className="mt-2 text-gray-600">{generatedContent.meta_description}</p>
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: generatedContent.content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <svg className="animate-spin h-12 w-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={12} cy={12} r={10} />
                <path d="M4 12a8 8 0 1 1 16 0" />
            </svg>
        </div>
    );
};

export default Loading;
const AbstractLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-75">
      <div className="flex flex-col items-center space-y-6 rounded-lg bg-white p-8 shadow-xl">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-primary"
            style={{ borderTopColor: 'transparent', animationDuration: '1.5s' }}
          ></div>
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
            <div className="h-10 w-10 animate-pulse rounded bg-primary"></div>
          </div>
        </div>
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <div className="flex space-x-1">
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default AbstractLoader

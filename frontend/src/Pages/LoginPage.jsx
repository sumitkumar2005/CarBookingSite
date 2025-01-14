

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-white rounded-lg shadow-lg w-96 p-8">
        <h2 className="text-center text-3xl font-semibold text-black mb-6">
          Welcome to the App
        </h2>
        <div className="space-y-6">
          <div className="text-center">
            <button className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md flex items-center justify-center">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/driver.png" // Captain icon
                alt="Captain"
                className="mr-2"
              />
              Login as Captain
            </button>
          </div>
          <div className="text-center">
            <button className="w-full bg-green-600 text-white py-3 rounded-md shadow-md flex items-center justify-center">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/rider.png" // Rider icon
                alt="Rider"
                className="mr-2"
              />
              Login as Rider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

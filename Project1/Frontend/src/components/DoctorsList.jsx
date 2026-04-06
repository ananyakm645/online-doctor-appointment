import { useEffect, useState } from "react";

function DoctorsList({ onBack }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");

      console.log("STATUS:", response.status);

      if (!response.ok) {
        console.log("FAILED:", response.status);
        return;
      }

      const data = await response.json();

      const doctorList = data.filter((user) => user.role === "DOCTOR");

      console.log("DOCTORS:", doctorList);

      setDoctors(doctorList);

    } catch (error) {
      console.error("ERROR:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">

      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-5xl animate-fadeIn">

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Doctors List 👨‍⚕️
        </h2>

        {doctors.length === 0 ? (
          <p className="text-center text-gray-500 animate-pulse">
            No doctors found
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {doctors.map((doc, index) => (
              <div
                key={doc.id}
                className="bg-white shadow-lg rounded-2xl p-5 hover:scale-105 transition duration-300 ease-in-out animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">

                  <div className="text-4xl mb-3">👨‍⚕️</div>

                  <h3 className="text-xl font-semibold text-gray-800">
                    Dr. {doc.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {doc.email}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    ID: {doc.id}
                  </p>

                </div>
              </div>
            ))}

          </div>
        )}

        <div className="flex justify-center mt-8">
          {/* ✅ SAFE BACK FIX */}
          <button
            onClick={() => {
              if (onBack) onBack();
              else console.log("onBack not passed ❌");
            }}
            className="px-6 py-2 border border-white text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition duration-300 shadow-md"
          >
            Back
          </button>
        </div>

      </div>

      {/* ✨ Animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-in-out;
          }

          .animate-slideUp {
            animation: slideUp 0.5s ease forwards;
            opacity: 0;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default DoctorsList;
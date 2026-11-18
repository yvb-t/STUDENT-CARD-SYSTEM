import { useState } from "react";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import StudentPage from "./components/StudentPage";
import StudentCardSystem from "./components/StudentCardSystem";
import { useStudents } from "./hooks/useStudents";
import { useCollegeName } from "./hooks/useCollegeName";
import "./styles/app.css";

export default function App() {
  const [students, setStudents] = useStudents();
  const [collegeName, setCollegeName] = useCollegeName();
  const [session, setSession] = useState({ role: null, id: null });

  const signOut = () => setSession({ role: null, id: null });

  if (!session.role) {
    return (
      <div className="sc-app">
        <LoginPage
          students={students}
          onStudent={(id) => setSession({ role: "student", id })}
          onStaff={() => setSession({ role: "staff", id: null })}
        />
      </div>
    );
  }

  return (
    <div className="sc-app">
      <Header role={session.role} collegeName={collegeName} onSignOut={signOut} />
      {session.role === "staff" ? (
        <StudentCardSystem
          students={students}
          setStudents={setStudents}
          collegeName={collegeName}
          setCollegeName={setCollegeName}
        />
      ) : (
        <StudentPage
          student={students.find((s) => s.id === session.id)}
          collegeName={collegeName}
        />
      )}
    </div>
  );
}

export { StudentCard } from "./components/card";
export { default as StudentCardSystem } from "./components/StudentCardSystem";

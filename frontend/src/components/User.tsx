import { useLocation } from "react-router-dom";

export default function User() {
  const location = useLocation();
  return (
    <div className="w-screen h-screen grid place-content-center">
      <div className="p-2 border border-black">
        <p>EmpId: {location.state.empId}</p>
        <p>EmpName: {location.state.name}</p>
        <p>EmpDesignation: {location.state.designation}</p>
        <p>EmpRole: {location.state.role}</p>
        {location.state.productManagerId !== -1 && (
          <p>Project Manager Id: {location.state.productManagerId}</p>
        )}
      </div>
    </div>
  );
}

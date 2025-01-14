import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function Profile() {
  const [name, setName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    axios
      .get(
        `http://ec2-43-204-221-94.ap-south-1.compute.amazonaws.com:8080/user/${location.state?.empId}`
      )
      .then((response) => {
        setName(response.data.user.name);
        setDesignation(response.data.user.designation);
        setRole(response.data.user.role);
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          console.log("Error fetching user information " + e.message);
        }
      });
  }, []);

  async function handleUserUpdate(
    e: FormEvent<HTMLFormElement>,
    empId: number
  ) {
    e.preventDefault();

    console.log("Calling Handle User=====================================");
    try {
      await axios.patch(
        `http://ec2-43-204-221-94.ap-south-1.compute.amazonaws.com:8080/user/${empId}`,
        {
          name,
          designation,
          role,
        }
      );
      console.log("Updated");
      return navigate("/home");
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Failed to update user");
      }
    }
  }

  return (
    <form
      onSubmit={(e) => handleUserUpdate(e, location.state.empId)}
      className="w-screen h-screen grid place-content-center"
    >
      <div className="grid grid-rows-2 grid-cols-2">
        <p className="px-4 py-2 border rounded bg-gray-300 m-2 text-center">
          ID: {location.state?.empId}
        </p>
        <input
          className="px-4 py-2 border rounded border-gray-500 m-2"
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter Employee Name"
          value={name}
        />
        <input
          className="px-4 py-2 border rounded border-gray-500 m-2"
          onChange={(e) => setRole(e.target.value)}
          type="string"
          placeholder="Enter Employee Role"
          value={role}
        />
        <input
          className="px-4 py-2 border rounded border-gray-500 m-2"
          onChange={(e) => setDesignation(e.target.value)}
          type="text"
          placeholder="Enter Employee Designation"
          value={designation}
        />
      </div>
      <button className="border rounded border-gray-500 px-4 py-2 m-2 hover:bg-gray-400 transition-all">
        update
      </button>
    </form>
  );
}

import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserType {
  empId: number;
  name: string;
  designation: string;
  role: "Intern" | "PM" | "Founder";
  password: string;
}

enum Role {
  Intern = "Intern",
  PM = "PM",
}
interface JwtPayload {
  empId: number;
  role: Role;
  users: number[];
}

export default function Home() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loggedUser, setLoggedUser] = useState<JwtPayload | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const jwtPayload: JwtPayload = jwtDecode(token);
      console.log(jwtPayload);
      if (jwtPayload !== undefined) setLoggedUser(jwtPayload);
    }

    axios
      .get(
        "ec2-13-235-80-244.ap-south-1.compute.amazonaws.com:8080/user/all",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          console.log("Failed to get users:", e.message);
        }
      });
  }, []);

  async function handleDeleteUser(empId: number) {
    try {
      await axios.delete(
        `http://ec2-43-204-221-94.ap-south-1.compute.amazonaws.com:8080/user/${empId}`
      );
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Unable to delete User");
      }
    }
  }

  function handleLogout() {
    localStorage.setItem("token", "");
    setLoggedUser(null);
    navigate("/signin");
  }
  return (
    <div className="flex p-4 w-screen h-screen">
      <div className="w-full h-full grid place-content-center">
        {users.map((user: UserType) => (
          <div key={user.empId} className="m-1 border border-black p-2">
            <p>EmpId: {user.empId}</p>
            <p>EmpName: {user.name}</p>
            <button
              onClick={() => navigate("/user", { state: { ...user } })}
              className="border border-black rounded px-2 hover:bg-gray-400 transition-all mr-2"
            >
              view
            </button>
            {loggedUser?.role === "PM" &&
              loggedUser.users.includes(user.empId) && (
                <button
                  onClick={() => handleDeleteUser(user.empId)}
                  className="border border-black rounded px-2 hover:bg-red-500 hover:text-white transition-all"
                >
                  delete
                </button>
              )}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <button
          onClick={handleLogout}
          className="py-2 px-4 border border-black w-fit h-fit rounded hover:bg-red-500 hover:text-white transition-all"
        >
          logout
        </button>
        <button
          onClick={() => navigate("/edit", { state: { ...loggedUser } })}
          className="py-2 px-4 border border-black w-fit h-fit rounded hover:bg-blue-500 hover:text-white transition-all"
        >
          update
        </button>
      </div>
    </div>
  );
}

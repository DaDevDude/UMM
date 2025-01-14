import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [empId, setEmpId] = useState<number>(-1);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await axios.post("http://ec2-43-204-221-94.ap-south-1.compute.amazonaws.com:8080/user/login", {
        empId,
        password,
      });

      if (response.data.token === undefined) {
        return navigate("/signup");
      }
      localStorage.setItem("token", response.data.token);
      return navigate("/home");
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log("Error creating User: " + e.message);
      }
    }
  }

  return (
    <form
      onSubmit={(e) => handleFormSubmit(e)}
      className="w-screen h-screen grid place-content-center"
    >
      <div className="grid grid-cols-2">
        <input
          className="px-4 py-2 border rounded border-gray-500 m-2"
          onChange={(e) => setEmpId(Number(e.target.value))}
          type="number"
          placeholder="Enter Employee Id"
        />
        <input
          className="px-4 py-2 border rounded border-gray-500 m-2"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter Your Password"
        />
      </div>
      <button className="border rounded border-gray-500 px-4 py-2 m-2 hover:bg-gray-400 transition-all">
        SignIn
      </button>
    </form>
  );
}

import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className="text-3xl font-bold text-blue-600">Vendor Login</h1>
      <div className="max-w-sm mx-auto mt-6">
        <Input label="Email" type="email" placeholder="you@example.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
        <Button variant="primary">Log in</Button>
      </div>
    </div>
  );
}

export default Login;
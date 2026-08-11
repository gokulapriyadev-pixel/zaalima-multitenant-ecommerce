import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  return (
    <AuthCard title="Vendor Login">
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" placeholder="••••••••" />
      <Button variant="primary">Log in</Button>
    </AuthCard>
  );
}

export default Login;
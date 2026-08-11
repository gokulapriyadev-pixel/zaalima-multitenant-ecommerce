import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import Input from "../components/Input";

function Register() {
  return (
    <AuthCard title="Vendor Registration">
      <Input label="Store name" type="text" placeholder="Your store name" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" placeholder="••••••••" />
      <Button variant="primary">Create account</Button>
    </AuthCard>
  );
}

export default Register;
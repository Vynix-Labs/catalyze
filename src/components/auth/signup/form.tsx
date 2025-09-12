function SignUpForm() {
  return (
    <form className="space-y-6">
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter Email Address"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <div className="relative form-control">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create Password"
          />
        </div>
      </div>
    </form>
  );
}

export default SignUpForm;

function ForgetPasswordForm() {
  return (
    <form>
      <div className="form-control">
        <label htmlFor="email"> email address</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="enter email address"
        />
      </div>
    </form>
  );
}

export default ForgetPasswordForm;

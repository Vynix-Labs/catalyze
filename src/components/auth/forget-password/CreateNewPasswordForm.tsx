function CreateNewPasswordForm() {
  return (
    <form className="space-y-6">
      <div className="form-control">
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="enter new password"
        />
      </div>
      <div className="form-control">
        <label htmlFor="confirm-password">confirm password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="re-enter new password"
        />
      </div>
    </form>
  );
}

export default CreateNewPasswordForm;

function Divider() {
  return (
    <div className="flex gap-2 items-center">
      <hr className="flex-1 border border-gray-200 border-collapse" />
      <p className="font-semibold text-sm text-gray-600">or</p>
      <hr className="flex-1 border border-gray-200 border-collapse" />
    </div>
  );
}

export default Divider;

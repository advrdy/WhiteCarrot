const SignInButton = ({ googleSignIn }) => {
  return (
    <div className="flex justify-center items-center mt-64">
      <button
        onClick={googleSignIn}
        className="py-5 px-5 bg-white text-2xl text-blue rounded-lg shadow-md hover:bg-slate-200 flex items-center font-bold"
      >
        Sign In with
        <span className="text-[#4285F4] ml-3 text-3xl">G</span>
        <span className="text-[#EA4335] text-3xl">o</span>
        <span className="text-[#FBBC05] text-3xl">o</span>
        <span className="text-[#4285F4] text-3xl">g</span>
        <span className="text-[#34A853] text-3xl">l</span>
        <span className="text-[#EA4335] text-3xl">e</span>
      </button>
    </div>
  );
};

export default SignInButton;

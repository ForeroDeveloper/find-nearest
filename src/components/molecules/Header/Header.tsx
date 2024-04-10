import { FC } from "react";

export const Header: FC = () => {
  return (
    <div className="flex justify-between items-center px-16 py-2">
      <p className="inline-block text-transparent lg:px-0 bg-clip-text py-4 text-2xl font-bold bg-gradient-to-r from-primary to-secondary font-squarePeg">
        Find Nearest
      </p>
      <div className="flex gap-4 cursor-pointer">
        <span>Home</span>
        <span>Choice</span>
        <span>Services</span>
        <span>Work</span>
      </div>
      <button className="btn btn-primary btn-md w-[120px]">Lets go!</button>
    </div>
  );
};

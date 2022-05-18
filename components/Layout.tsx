import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="relative">
    <div className="theme">{props.children}</div>
  </div>
);

export default Layout;

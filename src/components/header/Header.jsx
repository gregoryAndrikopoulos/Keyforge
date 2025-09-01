import "./header.css";

const Header = () => {
  return (
    <header id="top" className="header" role="banner" data-testid="header.root">
      <h1 className="title" data-testid="header.title">
        Keyforge
      </h1>
      <p className="subtitle" data-testid="header.subtitle">
        A down to business password generator
      </p>
    </header>
  );
};

export default Header;

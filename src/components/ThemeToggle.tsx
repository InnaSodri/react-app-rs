import { useTheme } from '../contexts';
import './styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="cosmic-toggle">
      <input
        type="checkbox"
        className="toggle"
        onChange={toggleTheme}
        checked={theme === 'dark'}
      />
      <span className="slider">
        <div className="cosmos"></div>
        <div className="toggle-orb">
          <div className="inner-orb"></div>
          <div className="ring"></div>
        </div>
        <div className="pulse-line"></div>
        <div className="pulse-line"></div>
        <div className="pulse-line"></div>
        <div className="glow-particles">
          <div className="glow angle30"></div>
          <div className="glow angle60"></div>
          <div className="glow angle90"></div>
          <div className="glow angle120"></div>
          <div className="glow angle150"></div>
          <div className="glow angle180"></div>
        </div>
      </span>
    </label>
  );
};

export default ThemeToggle;

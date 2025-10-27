import { NavLink } from 'react-router-dom';

type Props = {
  title: string;
  description: string;
  link: string;
};

const NavCard = ({ title, description, link }: Props) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `
        block p-6 rounded-xl shadow-md transition-all duration-300
        bg-white border border-gray-200 hover:shadow-lg
        hover:border-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-500 hover:to-yellow-400
        group relative
        ${isActive ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
        `
      }
    >
      <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-white transition-colors">
        {title}
      </h2>

      <div
        className="
          max-h-35 overflow-y-auto pr-1
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md 
          scrollbar-track-transparent
          group-hover:scrollbar-thumb-white/60
        "
      >
        <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </NavLink>
  );
};

export default NavCard;

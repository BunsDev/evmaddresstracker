import React from 'react';

// displays a page header

export default function Header({ link, title, subTitle }) {
  return (
    <div>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-green-700">
          {title}
        </h2>
      </a>
      <p className="text-sm font-normal italic text-gray-500 dark:text-slate-100 tracking-wide">{subTitle}</p>
    </div>
  );
}

Header.defaultProps = {
  link: 'https://github.com/farque65/evmaddresstracker',
  title: 'EVMAT',
  subTitle: 'EVM Address Tracker',
};

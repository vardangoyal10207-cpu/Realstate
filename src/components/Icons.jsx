const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false };

const make = (children, extra = {}) =>
  function Icon({ size, className = '', ...props }) {
    return (
      <svg {...base} {...extra} {...(size ? { width: size, height: size } : {})} className={className} {...props}>
        {children}
      </svg>
    );
  };

export const IconSearch = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const IconHeart = make(<path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.8 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.2 0 5.4 3.1 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z" />);
export const IconBed = make(<><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.5" /></>);
export const IconBath = make(<><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2" /></>);
export const IconArea = make(<><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>);
export const IconPin = make(<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>);
export const IconPhone = make(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />);
export const IconMail = make(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />);
export const IconClose = make(<path d="m6 6 12 12M18 6 6 18" />);
export const IconChevronLeft = make(<path d="m15 5-7 7 7 7" />);
export const IconChevronRight = make(<path d="m9 5 7 7-7 7" />);
export const IconChevronDown = make(<path d="m6 9 6 6 6-6" />);
export const IconCheck = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const IconFilter = make(<path d="M4 6h16M7 12h10M10 18h4" />);
export const IconGrid = make(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>);
export const IconList = make(<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />);
export const IconMap = make(<><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14" /></>);
export const IconShare = make(<><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></>);
export const IconExpand = make(<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />);
export const IconCar = make(<><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 13h.01M17 13h.01" /></>);
export const IconCalendar = make(<><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>);
export const IconLot = make(<path d="M3 20 9 6l5 9 3-4 4 9H3Z" />);
export const IconStar = make(<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" fill="currentColor" />);
export const IconQuote = make(<path d="M7 17c-2 0-3-1.5-3-3.5C4 10 6 8 9 7M17 17c-2 0-3-1.5-3-3.5 0-3.5 2-5.5 5-6.5" />);
export const IconHome = make(<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z" />);
export const IconUsers = make(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>);
export const IconTrash = make(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />);
export const IconEdit = make(<path d="M4 20h4L19 9l-4-4L4 16v4ZM13 7l4 4" />);
export const IconPlus = make(<path d="M12 5v14M5 12h14" />);
export const IconLogout = make(<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" />);
export const IconInbox = make(<><path d="M3 13h5l1 3h6l1-3h5M3 13l3-8h12l3 8v6H3v-6Z" /></>);
export const IconSettings = make(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>);
export const IconUpload = make(<path d="M12 16V4M7 9l5-5 5 5M4 20h16" />);
export const IconWhatsApp = make(<path d="M3 21l1.6-5A9 9 0 1 1 8 19.4L3 21Zm6-12c0 3.5 3 6.5 6.5 6.5l1.2-1.6-2.2-1-1 .8a5 5 0 0 1-2.5-2.5l.8-1-1-2.2L9 9Z" />);

// Brand icons (simple stroke glyphs)
export const IconInstagram = make(<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></>);
export const IconFacebook = make(<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" />);
export const IconLinkedin = make(<><path d="M7 10v7M7 7h.01M11 17v-7M11 13a3 3 0 0 1 6 0v4" /><rect x="3" y="3" width="18" height="18" rx="3" /></>);
export const IconYoutube = make(<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" /></>);
export const IconX = make(<path d="M4 4l16 16M20 4 4 20" />);

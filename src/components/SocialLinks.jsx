import { IconFacebook, IconInstagram, IconLinkedin, IconX, IconYoutube } from './Icons';

const NETWORKS = [
  { key: 'instagram', label: 'Instagram', Icon: IconInstagram },
  { key: 'facebook', label: 'Facebook', Icon: IconFacebook },
  { key: 'linkedin', label: 'LinkedIn', Icon: IconLinkedin },
  { key: 'youtube', label: 'YouTube', Icon: IconYoutube },
  { key: 'x', label: 'X', Icon: IconX },
];

export const SOCIAL_NETWORKS = NETWORKS;

export default function SocialLinks({ social = {}, className = '', linkClassName = 'bg-navy/5 text-navy hover:bg-navy hover:text-white' }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {NETWORKS.filter((n) => social[n.key]).map(({ key, label, Icon }) => (
        <li key={key}>
          <a href={social[key]} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} className={`flex h-10 w-10 items-center justify-center rounded-full transition duration-200 ${linkClassName}`}>
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

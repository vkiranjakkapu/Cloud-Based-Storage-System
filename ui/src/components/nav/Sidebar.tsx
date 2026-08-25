import { ArrowRightIcon, HomeIcon } from "@heroicons/react/16/solid";

export default function Sidebar() {
  return (
    <nav>
      <img src="" alt="CBSS ICON" />
      <ul>
        <li>
          <HomeIcon className="size-4" />
          <span>Folder</span>
          <ArrowRightIcon className="size-4" />
        </li>
      </ul>
    </nav>
  );
}

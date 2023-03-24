import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {APP_COLORS} from '../constants/colors';

export const ShowEyeIcon = ({
  width = '24',
  height = '24',
  color = APP_COLORS.GRAY,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12 8.11177C11.632 8.11752 11.2667 8.17598 10.9153 8.28538C11.0778 8.57125 11.1644 8.89403 11.1667 9.22288C11.1667 9.47823 11.1164 9.73108 11.0187 9.96699C10.9209 10.2029 10.7777 10.4173 10.5971 10.5978C10.4166 10.7784 10.2022 10.9216 9.96632 11.0193C9.73041 11.117 9.47757 11.1673 9.22222 11.1673C8.89336 11.165 8.57059 11.0785 8.28471 10.9159C8.05917 11.6982 8.08546 12.5315 8.35985 13.298C8.63425 14.0644 9.14284 14.7251 9.8136 15.1865C10.4843 15.6478 11.2832 15.8864 12.0971 15.8685C12.911 15.8505 13.6987 15.577 14.3484 15.0865C14.9982 14.5961 15.4772 13.9137 15.7176 13.1359C15.958 12.3581 15.9475 11.5244 15.6877 10.7528C15.428 9.98131 14.932 9.31107 14.2702 8.83706C13.6083 8.36306 12.8141 8.10931 12 8.11177ZM21.8792 11.4937C19.9962 7.81975 16.2684 5.33398 12 5.33398C7.73159 5.33398 4.00276 7.82149 2.12081 11.4941C2.04138 11.6512 2 11.8248 2 12.0008C2 12.1769 2.04138 12.3505 2.12081 12.5076C4.0038 16.1816 7.73159 18.6673 12 18.6673C16.2684 18.6673 19.9972 16.1798 21.8792 12.5073C21.9586 12.3501 22 12.1765 22 12.0005C22 11.8244 21.9586 11.6508 21.8792 11.4937ZM12 17.0007C8.57465 17.0007 5.43436 15.0909 3.73853 12.0007C5.43436 8.91038 8.5743 7.00065 12 7.00065C15.4257 7.00065 18.5656 8.91038 20.2615 12.0007C18.566 15.0909 15.4257 17.0007 12 17.0007Z"
      fill={color}
    />
  </Svg>
);

export const HideEyeIcon = ({
  width = '24',
  height = '24',
  color = APP_COLORS.GRAY,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M18.6989 16.0475C20.8252 14.15 22.0002 12 22.0002 12C22.0002 12 18.2502 5.125 12.0002 5.125C10.7997 5.12913 9.61276 5.37928 8.5127 5.86L9.4752 6.82375C10.2845 6.52894 11.1389 6.3771 12.0002 6.375C14.6502 6.375 16.8489 7.835 18.4602 9.44625C19.2356 10.2259 19.9308 11.0814 20.5352 12C20.4627 12.1088 20.3827 12.2288 20.2914 12.36C19.8727 12.96 19.2539 13.76 18.4602 14.5538C18.2539 14.76 18.0389 14.9638 17.8139 15.1613L18.6989 16.0475Z"
      fill={color}
    />
    <Path
      d="M16.1212 13.469C16.4002 12.6888 16.4518 11.8454 16.2702 11.037C16.0885 10.2286 15.6811 9.48839 15.0952 8.9025C14.5093 8.31662 13.7691 7.90915 12.9607 7.72752C12.1523 7.54588 11.3089 7.59753 10.5287 7.87648L11.5575 8.90523C12.0378 8.83647 12.5276 8.88053 12.988 9.03393C13.4484 9.18733 13.8668 9.44585 14.2099 9.78899C14.5531 10.1321 14.8116 10.5505 14.965 11.0109C15.1184 11.4713 15.1625 11.9611 15.0937 12.4415L16.1212 13.469ZM12.4425 15.0927L13.47 16.1202C12.6898 16.3992 11.8464 16.4508 11.038 16.2692C10.2296 16.0876 9.48936 15.6801 8.90348 15.0942C8.3176 14.5083 7.91013 13.7681 7.72849 12.9597C7.54685 12.1513 7.59851 11.3079 7.87746 10.5277L8.90621 11.5565C8.83745 12.0369 8.88151 12.5267 9.03491 12.9871C9.18831 13.4475 9.44682 13.8658 9.78997 14.209C10.1331 14.5521 10.5515 14.8106 11.0119 14.964C11.4723 15.1174 11.9621 15.1615 12.4425 15.0927Z"
      fill={color}
    />
    <Path
      d="M6.1875 8.83664C5.9625 9.03664 5.74625 9.23914 5.54 9.44539C4.76456 10.225 4.0694 11.0806 3.465 11.9991L3.70875 12.3591C4.1275 12.9591 4.74625 13.7591 5.54 14.5529C7.15125 16.1641 9.35125 17.6241 12 17.6241C12.895 17.6241 13.7375 17.4579 14.525 17.1741L15.4875 18.1391C14.3874 18.6198 13.2005 18.87 12 18.8741C5.75 18.8741 2 11.9991 2 11.9991C2 11.9991 3.17375 9.84789 5.30125 7.95164L6.18625 8.83789L6.1875 8.83664ZM19.0575 19.9416L4.0575 4.94164L4.9425 4.05664L19.9425 19.0566L19.0575 19.9416Z"
      fill={color}
    />
  </Svg>
);

export const ArrowBackIcon = ({
  width = '24',
  height = '24',
  color = APP_COLORS.PRIMARY,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M16.5 3L7.5 12.002L16.495 21"
      stroke={color}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowGoIcon = ({
  width = '24',
  height = '24',
  color = APP_COLORS.PRIMARY,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M10 16L14 12L10 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const ProfileIcon = ({
  active = false,
  activeColor = APP_COLORS.PRIMARY,
  passiveColor = APP_COLORS.GRAY,
}) => {
  if (active) {
    return (
      <Svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.7561 5.55585C21.8306 7.63032 21.8306 10.9937 19.7561 13.0682C17.6817 15.1426 14.3183 15.1426 12.2438 13.0682C10.1694 10.9937 10.1694 7.63032 12.2438 5.55585C14.3183 3.48138 17.6817 3.48138 19.7561 5.55585Z"
          fill={activeColor}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 18.6772C22.072 18.6772 28 21.2999 28 25.3332V26.6666C28 27.4026 27.4027 27.9999 26.6667 27.9999H5.33333C4.59733 27.9999 4 27.4026 4 26.6666V25.3332C4 21.2986 9.928 18.6772 16 18.6772Z"
          fill={activeColor}
        />
      </Svg>
    );
  }
  return (
    <Svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19.7561 5.55585C21.8306 7.63032 21.8306 10.9937 19.7561 13.0682C17.6817 15.1426 14.3183 15.1426 12.2438 13.0682C10.1694 10.9937 10.1694 7.63032 12.2438 5.55585C14.3183 3.48138 17.6817 3.48138 19.7561 5.55585"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 18.6772C22.072 18.6772 28 21.2999 28 25.3332V26.6666C28 27.4026 27.4027 27.9999 26.6667 27.9999H5.33333C4.59733 27.9999 4 27.4026 4 26.6666V25.3332C4 21.2986 9.928 18.6772 16 18.6772"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const TaskIcon = ({
  active = false,
  activeColor = APP_COLORS.PRIMARY,
  passiveColor = APP_COLORS.GRAY,
}) => {
  if (active) {
    return (
      <Svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.2587 29.3334H6.81467C5.26 29.3334 4 28.0734 4 26.5187V12.4441C4 10.8894 5.26 9.62939 6.81467 9.62939H15.2587C16.8133 9.62939 18.0733 10.8894 18.0733 12.4441V26.5187C18.0747 28.0734 16.8133 29.3334 15.2587 29.3334Z"
          fill={activeColor}
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13.0027 9.62936L14.308 4.75336C14.7107 3.25203 16.2547 2.36003 17.756 2.76269L25.912 4.94803C27.4134 5.35069 28.3054 6.89336 27.9027 8.39603L24.26 21.9907C23.8574 23.492 22.3147 24.384 20.8134 23.9814L18.0734 23.248"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  return (
    <Svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2587 29.3334H6.81467C5.26 29.3334 4 28.0734 4 26.5187V12.4441C4 10.8894 5.26 9.62939 6.81467 9.62939H15.2587C16.8133 9.62939 18.0733 10.8894 18.0733 12.4441V26.5187C18.0747 28.0734 16.8133 29.3334 15.2587 29.3334Z"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.0027 9.62936L14.308 4.75336C14.7107 3.25203 16.2547 2.36003 17.756 2.76269L25.912 4.94803C27.4133 5.35069 28.3053 6.89336 27.9027 8.39603L24.26 21.9907C23.8573 23.492 22.3147 24.384 20.8133 23.9814L18.0733 23.248"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const RequestIcon = ({
  active = false,
  activeColor = APP_COLORS.PRIMARY,
  passiveColor = APP_COLORS.GRAY,
}) => {
  if (active) {
    return (
      <Svg
        width="32"
        height="32"
        viewBox="0 0 33 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M6.6502 10.1709H12.1525"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.00162 16.0066C3.99227 19.4255 5.44506 22.6854 7.99378 24.9643C10.5425 27.2432 13.9439 28.3237 17.3406 27.9334"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14.6728 4.0798C18.0694 3.68947 21.4708 4.76996 24.0196 7.04886C26.5683 9.32776 28.0211 12.5876 28.0117 16.0066"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.59369 4.6687L5.66903 12.0051"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13.0054 12.0051L9.59369 4.6687"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M21.3422 26.6779V18.6746"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M21.3422 26.6779H25.3759C26.4633 26.6779 27.3447 25.7964 27.3447 24.7091V24.7091C27.3447 23.6217 26.4633 22.7402 25.3759 22.7402H21.3422"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M21.3422 18.6746H24.8779C26.0006 18.6746 26.9108 19.5847 26.9108 20.7074V20.7074C26.9108 21.8301 26.0006 22.7403 24.8779 22.7403H21.3422"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  return (
    <Svg
      width="32"
      height="32"
      viewBox="0 0 33 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6.6502 10.1709H12.1525"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.00162 16.0066C3.99227 19.4255 5.44506 22.6854 7.99378 24.9643C10.5425 27.2432 13.9439 28.3237 17.3406 27.9334"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.6728 4.0798C18.0694 3.68947 21.4708 4.76996 24.0196 7.04886C26.5683 9.32776 28.0211 12.5876 28.0117 16.0066"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.59369 4.6687L5.66903 12.0051"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.0054 12.0051L9.59369 4.6687"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.3422 26.6779V18.6746"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.3422 26.6779H25.3759C26.4633 26.6779 27.3447 25.7964 27.3447 24.7091V24.7091C27.3447 23.6217 26.4633 22.7402 25.3759 22.7402H21.3422"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.3422 18.6746H24.8779C26.0006 18.6746 26.9108 19.5847 26.9108 20.7074V20.7074C26.9108 21.8301 26.0006 22.7403 24.8779 22.7403H21.3422"
        stroke={passiveColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const PlusIcon = ({size = 32, color = 'white'}) => (
  <Svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M8.95752 16H24.0425"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.5 8.45753V23.5425"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowUpIcon = ({
  width = '10',
  height = '6',
  color = APP_COLORS.FONT,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M9 5L5 1L1 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowDownIcon = ({
  width = '10',
  height = '6',
  color = APP_COLORS.FONT,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M1 1L5 5L9 1"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const Xicon = ({
  color = APP_COLORS.FONT
}) => (
  <Svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill={color}
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M13.3334 13.3335L26.6667 26.6668"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M26.6667 13.3335L13.3334 26.6668"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

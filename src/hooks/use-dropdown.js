import { useEffect, useState } from 'react';

const useDropDown = () => {
  const [itemHover, setItemHover] = useState(false);
  // const [dropDownHover, setDropDownHover] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const itemOnMouseEnter = () => {
    setItemHover(true);
  };

  const itemOnMouseLeave = () => {
    setItemHover(false);
  };

  // const dropDownOnMouseEnter = () => {
  //   setDropDownHover(true);
  // };

  // const dropDownOnMouseLeave = () => {
  //   setDropDownHover(false);
  // };

  useEffect(() => {
    setDropDownOpen(itemHover);
  }, [itemHover]);

  return {
    itemOnMouseEnter,
    itemOnMouseLeave,
    dropDownOpen,
  };
};

export default useDropDown;

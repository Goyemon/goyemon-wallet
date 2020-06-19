'use strict';

class StyleUtilities {
  static getBorderColor(validation) {
    if (validation === undefined) {
      return '#FFF';
    } else if (validation) {
      return '#1BA548';
    } else if (!validation) {
      return '#E41B13';
    }
  }

  static inOrOutIcon(type, direction) {
    switch (type) {
      case 'swap':
        return { name:"swap-horizontal", size:20, color:"#5F5F5F" }

      case 'transfer':
        if (direction == 'self')
          return { name:"arrow-collapse", size:20, color:"#5F5F5F" }
        else if (direction == 'outgoing')
          return (
            {
              name:"arrow-top-right-bold-outline",
              size:20,
              color:"#F1860E",
            }
          );
        return (
          {
            name:"arrow-bottom-left-bold-outline",
            size:20,
            color:"#1BA548",
          }
        );

      case 'approval':
      case 'deposit':
        return (
          {
            name:"arrow-top-right-bold-outline",
            size:20,
            color:"#F1860E",
          }
        );

      case 'withdraw':
        return (
          {
            name:"arrow-bottom-left-bold-outline",
            size:20,
            color:"#1BA548",
          }
        );

      case 'failure':
        return (
          {
            name:"alert-circle-outline",
            size:20,
            color:"#E41B13",
          }
        );

      default:
        return (
          {
            name:"arrow-top-right-bold-outline",
            size:20,
            color:"#F1860E",
          }
        );
    }
  }
}

export default StyleUtilities;

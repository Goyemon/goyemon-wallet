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
      case 'committed deposit withdraw':
      case 'open deposit withdraw':
      case 'sponsorship withdraw':
        return (
          {
            name:"arrow-bottom-left-bold-outline",
            size:20,
            color:"#1BA548",
          }
        );

      case 'multicontract':
        return (
          {
            name: 'call-split',
            size:20,
            color:"#5F5F5F"
          }
        )

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

  static minusOrPlusIcon(type, direction) {
    switch (type) {
      case 'deposit':
        return { name:"minus", size:16, color:"#F1860E" }

      case 'transfer':
        return direction === 'self'
        ? { name:"plus-minus", size:16, color:"#5F5F5F" }
        : direction === 'outgoing'
        ? { name:"minus", size:16, color:"#F1860E" }
        : { name:"plus", size:16, color:"#1BA548" }

      case 'rewarded':
      case 'withdraw':
      case 'committed deposit withdraw':
      case 'open deposit withdraw':
      case 'sponsorship withdraw':
        return { name:"plus", size:16, color:"#1BA548" }

      case 'swap':
      case 'approval':
      case 'failure':
      default:
        return { name:"", size:0, color:"" }
    }
  }
}

export default StyleUtilities;

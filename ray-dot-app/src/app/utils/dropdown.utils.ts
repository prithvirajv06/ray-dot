import { FoxDropDownItems } from '../ui-component/dropdown/dropdown.component';

export function getDropDownObjByDesc(items: FoxDropDownItems[], desc: string) {
  return items.find((i) => i.desc == desc);
}

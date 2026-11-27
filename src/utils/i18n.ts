import { useSettings } from '../stores/settings';
const dict = {
 home:{ar:'الرئيسية',en:'Home'},teacher:{ar:'الطلاب',en:'Students'},study:{ar:'المواد',en:'Subjects'},cards:{ar:'البطاقات',en:'Cards'},
 tasks:{ar:'المهام',en:'Tasks'},planner:{ar:'الخطة',en:'Planner'},focus:{ar:'التركيز',en:'Focus'},analytics:{ar:'التقدم',en:'Progress'},
 groups:{ar:'المجموعات',en:'Groups'},exams:{ar:'الامتحانات',en:'Exams'},finance:{ar:'الميزانية',en:'Budget'},calendar:{ar:'التقويم',en:'Calendar'},reports:{ar:'التقارير',en:'Reports'},settings:{ar:'الإعدادات',en:'Settings'}
} as const;
export type Key=keyof typeof dict;
export const useT=()=>{const lang=useSettings(s=>s.lang);return(k:Key)=>dict[k][lang];};
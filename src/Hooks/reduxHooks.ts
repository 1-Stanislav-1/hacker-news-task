import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {TDispatch, TRootReducer} from "../Types/reduxTypes";

export const useTypedDispatch = () => useDispatch<TDispatch>();
export const useTypedSelector: TypedUseSelectorHook<TRootReducer> = useSelector;
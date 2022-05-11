import { invokeFactory, sendFactory } from './nativeFactory';

const robotjsService = invokeFactory('robotjs', [
    'setMouseDelay', 
    'moveMouse', 
    'moveMouseSmooth', 
    'setMouseDelay', 
    'mouseClick', 
    'mouseToggle', 
    'dragMouse', 
    'getMousePos', 
    'scrollMouse', 

    'setKeyboardDelay', 
    'keyTap', 
    'keyToggle', 
    'typeString', 
    'typeStringDelayed', 

    'getPixelColor', 
    'getScreenSize', 
    'capture', 
]);
export default robotjsService;
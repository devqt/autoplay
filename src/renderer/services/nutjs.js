import { invokeFactory } from './nativeFactory';

const nutjsService = invokeFactory('nutjs', [
    'type', 
]);
export default nutjsService;
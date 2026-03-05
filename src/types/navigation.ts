// types/navigation.ts
import { Job } from './job';

/**
 * Defines all screens in the root stack and their route params.
 * Used by useNavigation and useRoute for full type safety.
 */
export type RootStackParamList = {
  Home: undefined;
  Saved: undefined;
  Form: {
    job: Job;
    fromSaved: boolean;
  };
};
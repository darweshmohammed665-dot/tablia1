import { auth } from '../firebase';
import { toast } from 'sonner';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  // User-friendly error mapping
  let userMessage = 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.';
  
  if (errorMessage.includes('quota exceeded')) {
    userMessage = 'عذراً، تم تجاوز الحصة اليومية للخدمة. يرجى المحاولة غداً.';
  } else if (errorMessage.includes('permission-denied')) {
    userMessage = 'عذراً، ليس لديك الصلاحية لإجراء هذه العملية.';
  } else if (errorMessage.includes('too-large')) {
    userMessage = 'عذراً، حجم البيانات (ربما الصور) كبير جداً. يرجى تقليل عدد الصور أو حجمها.';
  } else if (errorMessage.includes('offline')) {
    userMessage = 'يبدو أنك غير متصل بالإنترنت. يرجى التحقق من اتصالك.';
  }

  toast.error(userMessage, {
    description: `نوع العملية: ${operationType}`,
    duration: 5000
  });

  throw new Error(JSON.stringify(errInfo));
}

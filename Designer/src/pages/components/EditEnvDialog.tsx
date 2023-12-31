/**
 * 编辑应用环境弹窗
 */
import { schema2component } from '@/components/SchemaRender';
import { injectContext } from '@/utils/inject';
import EditEnvDialogSchema from '@/schema/components/EditEnvDialog.json';

export default schema2component(
  EditEnvDialogSchema,
  ({onConfirm, pages, ...rest}: any) => {
    const context = injectContext({
      store: window.store
    })
    return {
      ...rest,
      data: {
        pages,
        /** 需要手动注入context */
        ...context,
      },
      onConfirm: (values: Array<any>) => onConfirm && onConfirm(values[0]),
      // onClose: () => window.store.toggleEnvDialogShow(false)
    };
  }
);

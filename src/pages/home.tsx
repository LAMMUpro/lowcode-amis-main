import { StoreType } from "@/store";
import { inject, observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import React from 'react';
import SchemaRender from "@/components/SchemaRender";
import EditEnvDialog from "./components/EditEnvDialog";
import homeSchema from "@/schema/home.json";

export default inject('store')(
  observer(function ({
    store,
    location,
    history
  }: {store: StoreType} & RouteComponentProps) {
    function test(values: any) {
      console.log(values);
    }
    return (
      <div>
        <SchemaRender schema={homeSchema}/>
        <EditEnvDialog
          show={store.isShowEnvDialog}
          onConfirm={test}
          onClose={() => store.toggleEnvDialogShow(false)}
        ></EditEnvDialog>
      </div>
    );
  })
);

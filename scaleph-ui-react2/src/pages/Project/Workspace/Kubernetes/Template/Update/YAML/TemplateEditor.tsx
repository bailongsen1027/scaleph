import React, {useEffect, useRef} from "react";
import {connect} from "@umijs/max";
import Editor, {Monaco, useMonaco} from "@monaco-editor/react";
import {Props} from '@/typings';
import {WsFlinkKubernetesTemplate} from "@/services/project/typings";

const TemplateEditor: React.FC<Props<WsFlinkKubernetesTemplate>> = (props: any) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }, [monaco]);

  const handleEditorDidMount = (editor, monaco: Monaco) => {
    editorRef.current = editor;
  }

  return (
    <Editor
      width="730"
      height="600px"
      language="yaml"
      theme="vs-white"
      value={props.flinkKubernetesTemplateUpdate.templateYaml}
      options={{
        selectOnLineNumbers: true,
        readOnly: true,
        minimap: {
          enabled: false
        }
      }}
      onMount={handleEditorDidMount}
    />
  );
}
const mapModelToProps = ({flinkKubernetesTemplateUpdate}: any) => ({flinkKubernetesTemplateUpdate})
export default connect(mapModelToProps)(TemplateEditor);

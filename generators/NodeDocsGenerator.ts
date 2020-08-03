import { execSync as exec } from "child_process";
import { join } from "path";
import Generator from "./Generator";
import { AuthEnum } from "../utils/enums";
import readdir from "../utils/readdir";

/**Responsible for generating the node functionality documentation file and the node credential documentation file.*/
export default class NodeDocsGenerator extends Generator {
  private docsParameters: DocsParameters;
  private metaParameters: MetaParameters;
  private mainParameters: MainParameters;

  constructor(paramsBundle: DocsgenParamsBundle) {
    super();
    this.docsParameters = paramsBundle.docsParameters;
    this.metaParameters = paramsBundle.metaParameters;
    this.mainParameters = paramsBundle.mainParameters;
  }

  public async run() {
    this.generateNodeMainDocs();

    if (this.metaParameters.authType !== AuthEnum.None) {
      this.generateNodeCredentialDocs();
    }

    try {
      await this.verifyGeneratedDocsFiles();
      return { completed: true, error: false };
    } catch (thrownError) {
      return { completed: false, error: true, errorMessage: thrownError };
    }
  }

  /**Generate the node functionality documentation file.*/
  private generateNodeMainDocs() {
    const command = this.formatCommand(`
    gen generateNodeMainDocs
      --name '${this.metaParameters.serviceName}'
      --docsParameters '${JSON.stringify(this.docsParameters)}'
      --nodeOperations '${JSON.stringify(this.getNodeOperations())}'
    `);

    exec(command);
  }

  /**Generate the node credential documentation file.*/
  private generateNodeCredentialDocs() {
    const command = this.formatCommand(`
    gen generateNodeCredentialDocs
      --name '${this.metaParameters.serviceName}'
      --docsParameters '${JSON.stringify(this.docsParameters)}'
      --metaParameters '${JSON.stringify(this.metaParameters)}'
    `);

    exec(command);
  }

  private getNodeOperations() {
    const nodeOperations: { [key: string]: string[] } = {};

    Object.keys(this.mainParameters).forEach((resource) => {
      nodeOperations[resource] = this.mainParameters[resource].map(
        (operation) => operation.description
      );
    });

    return nodeOperations;
  }

  /**Verify if the one to two files that are to be generated by `generateNodeDocsFiles` were actually generated.*/
  private async verifyGeneratedDocsFiles() {
    const files = await readdir(join("output"));

    const wasGenerated = (snippet: string) =>
      files.some((file) => file.endsWith(snippet));

    const filesToBeVerified = [this.getMainDocFilename() + ".md"];

    if (this.metaParameters.authType !== AuthEnum.None) {
      filesToBeVerified.push("Credentials.md");
    }

    filesToBeVerified.forEach((file) => {
      if (!wasGenerated(file)) {
        throw Error("Generation failed for file: " + file);
      }
    });
  }

  private getMainDocFilename() {
    return this.metaParameters.serviceName.replace(/\s/g, "");
  }
}

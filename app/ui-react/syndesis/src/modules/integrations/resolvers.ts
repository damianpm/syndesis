/* tslint:disable:object-literal-sort-keys no-empty-interface */
import { getEmptyIntegration } from '@syndesis/api';
import { IIntegrationOverviewWithDraft } from '@syndesis/models';
import {
  makeResolver,
  makeResolverNoParams,
  makeResolverNoParamsWithDefaults,
} from '@syndesis/utils';
import {
  IBaseFlowRouteParams,
  IBaseRouteParams,
  IBaseRouteState,
  ISaveIntegrationRouteParams,
  ISaveIntegrationRouteState,
  ISelectConnectionRouteParams,
  ISelectConnectionRouteState,
} from './components/editor/interfaces';
import {
  IEditorBase,
  IEditorIndex,
  makeEditorResolvers,
} from './components/editor/makeEditorResolvers';
import {
  IDetailsRouteParams,
  IDetailsRouteState,
} from './pages/detail/interfaces';
import routes from './routes';

export const configureIndexMapper = ({
  flowId,
  integration,
}: IEditorIndex) => ({
  params: {
    flowId: flowId ? flowId : integration.flows![0].id!,
    integrationId: integration.id!,
  } as IBaseFlowRouteParams,
  state: {
    integration,
  } as IBaseRouteState,
});

export const configureSaveMapper = ({ flowId, integration }: IEditorIndex) => ({
  params: {
    integrationId: integration.id!,
  } as ISaveIntegrationRouteParams,
  state: {
    flowId,
    integration,
  } as ISaveIntegrationRouteState,
});

export const configureApiProviderOperationsMapper = ({
  integration,
}: IEditorBase) => ({
  params: {
    integrationId: integration.id,
  } as IBaseRouteParams,
  state: {
    integration,
  } as IBaseRouteState,
});

// TODO: unit test every single one of these resolvers 😫

export const listResolver = makeResolverNoParams(routes.list);

export const manageCicdResolver = makeResolverNoParams(routes.manageCicd.root);

export const integrationActivityResolver = makeResolver<
  { integrationId: string; integration?: IIntegrationOverviewWithDraft },
  IDetailsRouteParams,
  IDetailsRouteState
>(routes.integration.activity, ({ integrationId, integration }) => ({
  params: {
    integrationId,
  },
  state: {
    integration,
  },
}));

export const integrationDetailsResolver = makeResolver<
  { integrationId: string; integration?: IIntegrationOverviewWithDraft },
  IDetailsRouteParams,
  IDetailsRouteState
>(routes.integration.details, ({ integrationId, integration }) => ({
  params: {
    integrationId,
  },
  state: {
    integration,
  },
}));

export const metricsResolver = makeResolver<
  { integrationId: string; integration?: IIntegrationOverviewWithDraft },
  IDetailsRouteParams,
  IDetailsRouteState
>(routes.integration.metrics, ({ integrationId, integration }) => ({
  params: {
    integrationId,
  },
  state: {
    integration,
  },
}));

const resolvers = {
  list: listResolver,
  manageCicd: {
    root: manageCicdResolver,
  },
  create: {
    root: makeResolverNoParams(routes.create.root),
    start: {
      ...makeEditorResolvers(routes.create.start),
      selectStep: makeResolverNoParamsWithDefaults<
        ISelectConnectionRouteParams,
        ISelectConnectionRouteState
      >(routes.create.start.selectStep, () => {
        const integration = getEmptyIntegration();
        return {
          params: {
            flowId: integration.flows![0].id!,
            integrationId: integration.id!,
            position: '0',
          },
          state: {
            integration,
          },
        };
      }),
    },
    finish: makeEditorResolvers(routes.create.finish),
    configure: {
      root: makeResolverNoParams(routes.create.configure.root),
      index: makeResolver<IEditorIndex, IBaseFlowRouteParams, IBaseRouteState>(
        routes.create.configure.index,
        configureIndexMapper
      ),
      apiProviderOperations: makeResolver<
        IEditorBase,
        IBaseRouteParams,
        IBaseRouteState
      >(
        routes.create.configure.apiProviderOperations,
        configureApiProviderOperationsMapper
      ),
      addStep: makeEditorResolvers(routes.create.configure.addStep),
      editStep: makeEditorResolvers(routes.create.configure.editStep),
      saveAndPublish: makeResolver<
        IEditorIndex,
        ISaveIntegrationRouteParams,
        ISaveIntegrationRouteState
      >(routes.create.configure.saveAndPublish, configureSaveMapper),
    },
  },
  integration: {
    root: makeResolverNoParams(routes.integration.root),
    activity: integrationActivityResolver,
    details: integrationDetailsResolver,
    edit: {
      root: makeResolver<IEditorIndex, IBaseFlowRouteParams, IBaseRouteState>(
        routes.integration.edit.root,
        configureIndexMapper
      ),
      index: makeResolver<IEditorIndex, IBaseFlowRouteParams, IBaseRouteState>(
        routes.integration.edit.index,
        configureIndexMapper
      ),
      apiProviderOperations: makeResolver<
        IEditorBase,
        IBaseRouteParams,
        IBaseRouteState
      >(
        routes.integration.edit.apiProviderOperations,
        configureApiProviderOperationsMapper
      ),
      addStep: makeEditorResolvers(routes.integration.edit.addStep),
      editStep: makeEditorResolvers(routes.integration.edit.editStep),
      saveAndPublish: makeResolver<
        IEditorIndex,
        ISaveIntegrationRouteParams,
        ISaveIntegrationRouteState
      >(routes.integration.edit.saveAndPublish, configureSaveMapper),
    },
    metrics: metricsResolver,
  },
  import: makeResolverNoParams(routes.import),
};

export default resolvers;

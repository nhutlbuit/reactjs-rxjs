# Overview libraries using in the project

This uses some supporting plugins:
- React Libraries (Main Platform): 'react', 'react-dom'.
- React Router V4 (React Plugin): 'react-router', 'react-router-dom'.
- Redux (Management State Library): 'redux', 'redux-react', '@reduxjs/toolkit'.
- Middleware Saga(handle side effect: asynchronous, timer...base on generators in JavaScript (- from es6): 'redux-saga'.
- Webpack (Bundling Module support to build project): 'webpack'
- SASS - Pre-Processor: 'sass', 'node-sass'
- Library UI: 'react-bootstrap',
- react-select: a component build for ReactJS with multiselect, autocomplete and ajax support.
- react-date-picker.
- react-toastify.

# Guideline for focusing and developing to project

## 1. Using command line (CLI) in project

*Note: You can 'yarn' or 'npm' to work with this project.

Current time, we just use 'start' & 'build' to develop and pack modules in the project:

- Build project for the production environment:
```
  npm build    
  yarn build 
```

- Start project at dev environment:
```
  npm start
  yarn start
```
## 2. Structure of project
```
Corporate-account-ui
├───nginx
└───src
	│   index.html
	│   index.tsx
	├───app
	│   │   app.scss
	│   │   App.tsx
	│   └───shared (shared commponent)
	│   ├───corporate-account-tool
	│   │   ├───header-bar
	│   │   ├───nav-bar
	│   │   └───search-panel
	│   └───corporate-account-report
	├───assets
	├───common
	│   ├───constants
	│   ├───enums
	│   └───types
	├───services
	└───store
		│   store.ts
		├───middleware
		│       root.saga.ts
		└───slice
				root.reducer.ts
```
- 2.1. <b>tsconfig.json</b>:
  <br>File configures for typescript project such as compile decorator.

- 2.2. <b>package.json</b>
  <br>File contains all configurations of project (libs-dependencies, script-task, plugins...)
  
- 2.3. <b>nginx/</b> folder:
  <br>It stores some configurations for running project with nginx.

- 2.4. <b>build/</b> folder:
  <br>It stores sources of project after building.

- 2.5. <b>public/</b> folder:
  <br>It stores sources (css, data-resources, fonts, images, locales) of project after building at the dev environment.  
    
- 2.6. <b>script/</b> folder:
  <br>It includes files using to build and start project.

- 2.7. <b>src/</b>
<br>This is the main folder in project. You can develop anything in here. It separates to 5 sub-folders: <b>api/ , common/ , component/ , static/, middleware/, slice/, store app.tsx and index.tsx file </b> 

	- 2.7.1. <b>api/</b> folder
    <br>This includes all of apis.

	- 2.7.2. <b>common/</b> folder
    <br>This includes common files, logic, component, constant... which can re-use more than one time in project.
  
  	- 2.7.3. <b>component/</b> folder
    <br>This includes ts and scss files of component group by every feature.

    - 2.7.4. <b>static/</b> folder
    <br>Folder stores build svn version.

	- 2.7.5. <b>middleware/</b> folder
    <br>This includes middleware as redux-saga, redux thunk (this project apply **redux-saga**).

	- 2.7.6. <b>slice/</b> folder
    <br>This includes actions and reducers of redux. 'Redux Toolkit' has recommended by the Redux base on 4 criteria: Simple, Opinionated, Powerful, Effective. <br/>
    *view more: https://redux-toolkit.js.org*

	- 2.7.7. <b>store/</b> folder
    <br>This folder includes file store to create a store to storage data to share between components.

    - 2.7.8. <b>app.tsx/</b> file
    <br>App.tsx is a start-point to any process, and imported out of <b>index.tsx</b> to run project.

     - 2.7.9 <b>index.tsx file</b>
    <br>This is the first file called from server after running project. All threads of project will begin from here.

    
## 3. Basic knowledge and how to apply to this project - Redux + Saga-middleware
  ### 3.1: Create a store - configureStore with redux-toolkit
  - To define a store and declare reducers
  ```
import createSagaMiddleware from 'redux-saga';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { initSaga } from '../middleware/Root.saga';

    const sagaMiddleware = createSagaMiddleware();
    
    const store = configureStore({
      reducer: {
        CommunicationTabs: tabAllReducer,
        NotificationTab: notificationTabReducer,
        HistoricalTab: historicalTabReducer,
        DataChange: dataChangeReducer
      },
      middleware: [...getDefaultMiddleware(), sagaMiddleware]
    });
    
    sagaMiddleware.run(initSaga);
    
    export default store;

  ```
### 3.2: To use this store:
  ```
	ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter basename='pacman-reactjs'>
          <App />
        </BrowserRouter>
      </Provider>,
    
    document.getElementById('root')	
```

### 3.3: Create file saga to watch action (in here is :'loadCommentsTab' which exporting from Slice).  
#### 3.3.1: Create a CommunicationTabsSaga file.
	```
	import { put, takeEvery, call, all } from 'redux-saga/effects';
    	import { commentsTabApi } from '../apis/communication-tabs.api';
    
    	import { loadCommentsTab, loadCommentsTabError, loadCommentsTabSuccess } from '../slice/CommunicationTabs.slice';
    
    	export function* loadingCommentsTabAsync(payload: any) {
    		try {
    			const data = yield call(commentsTabApi);
    			yield put(loadCommentsTabSuccess(data));
    		} catch (err) {
    			yield put(loadCommentsTabError());
    		}
    	}
    
    	export function* CommunicationTabsSaga() {
    	  yield all([
    	    // listening on every action then trigger call APIs
    		yield takeEvery(loadCommentsTab, loadingCommentsTabAsync);
    	  ]);
    	}
	```
#### 3.3.2: import CommunicationTabsSaga in initSaga to register sagaMiddleware.
```
    import {all} from "redux-saga/effects";
    import {CommunicationTabsSaga} from "./CommunicationTabs.saga";
    import {NotificationTabSaga} from "./NotificationTab.saga";
    import {HistoricalTabSaga} from "./HistoricalTab.saga";
    import { DataChangeSaga } from "./DataChange.saga";
    
    export function* initSaga() {
        yield all([
            CommunicationTabsSaga(),
            NotificationTabSaga(),
            HistoricalTabSaga(),
            DataChangeSaga()
        ]);
    }
```

### 3.4: Create a file slice and public a reducer and actions.
 ```
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
	import { toast } from "react-toastify";

	const initialState = {
		commentsTab: {},
		loading: false,
		error: ''
	};

	export const CommunicationTabsSlice = createSlice({
		name: 'tabAll',
		initialState,
		reducers: {
			loadCommentsTab: (state, action: PayloadAction<any>) => {
				state.loading = true;
				state.error = '';
			},
			loadCommentsTabSuccess: (state, action: PayloadAction<any>) => {
				state.loading = false;
				state.error = '';
				state.commentsTab = action.payload;
			},
			loadCommentsTabError: (state) => {
				state.error = 'failed';
				toast.error("Fetch data all-tab failed. Please contact admin!");
			},
		}
	});

	export const {
		loadCommentsTab,
		loadCommentsTabSuccess,
		loadCommentsTabError,
	} = CommunicationTabsSlice.actions;

	export default CommunicationTabsSlice.reducer;

```

### 3.5: Use in Component: dispatch actions to saga and reducer, after that use useSelector hook trigger to get data from store once data has updated.
 
```
	import { useDispatch, useSelector } from "react-redux";
	
	function nameComponent() {
		const dispatch = useDispatch();
		dispatch(loadCommentsTab(paramObject));
		const commentsTab = useSelector((state: any) => state.CommunicationTabs.commentsTab);
	}	
```

## 4. Define API services in Project.
```
export const commentsTabApi = async (userId: number) => {
  const response = await axios.get(`/member-manager/web/sv/customer-maintenance/commentsTab.sv?userId=${userId}&commentTab=all&page=1&rp=10`);
  return parseItem(response, 200);
};
```
#### View more: 
Using Axios with React: https://alligator.io/react/axios-react/ <br>
Using redux: https://redux.js.org/ <br>
Applying redux-saga middleware: https://redux-saga.js.org/ <br>
Redux-toolkit: https://redux-toolkit.js.org <br>

## 5. Integrate to backoffice project
- Open backoffice-portal project, go to *src/main/webapp/WEB-INF/components/tpl-sub-menu.jsp* and add the **'Communication'** sub-menu for the 'Communication Tab' menu.
```
<compress:html>
    {{  var per = data.permission;}}
    <ul>
       {{? per.COMMUNICATION_TAB_VIEW}}        
        <li id="communicationTab"><a href='#'><span class="glyphicon glyphicon-comment" aria-hidden="true"></span><span>${T["Communication"]}</span></a></li>
       {{?}}
    </ul>
    
</compress:html>
```
- Create a tpl-communication-page.jsp file after that embedded iframe which url as below to redirect to page communication tab.

`<iframe class="tab-pane active" id="page-s20" name="iContent" src="/pacman-reactjs/communication-tabs" frameborder="0"></iframe>`

## 6. Run project
1. npm run start (port 4200)
2. Start Nodejs server (default port 4200, Can change port at the pacman-reactjs\package.json\script\start).
3. Open web browser with url: http://your_ip/backoffice/index and login
4. Access to 'Customer Maintenance' dashboard url: http://your_ip:4200/backoffice/web/index#/customer-maintenance after that choose 'Communication' tab at a left menu.

## 7. Note commit in project
### Don't commit these paths folder and file in the project. Because, they will auto generate when build<br/>
 \pacman-reactjs\target<br/>
 \pacman-reactjs\build<br/>
 \pacman-reactjs\package-lock.json<br/>
 \pacman-reactjs\yarn-lock.json<br/>
 \pacman-reactjs\yarn.lock<br/>
 \pacman-reactjs\yarn-error.log<br/>
 \pacman-reactjs\debug.log<br/>



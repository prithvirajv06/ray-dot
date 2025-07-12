import { Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { ReferenceDataComponent } from './screens/reference-data/reference-data.component';
import { DataModelComponent } from './screens/data-model/data-model.component';
import { DecissionBuilderComponent } from './screens/decission-builder/decission-builder.component';
import { DecisionTableComponent } from './screens/decision-table/decision-table.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'reference-data',
    component: ReferenceDataComponent,
  },
  {
    path: 'data-model',
    component: DataModelComponent,
  },
  {
    path: 'if-then',
    component: DecissionBuilderComponent,
  },
  {
    path: 'decision-table',
    component: DecisionTableComponent,
  },
];

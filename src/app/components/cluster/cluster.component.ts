import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Cluster } from '../../models/cluster';
import { ClusterService } from '../../services/cluster.service';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  clusterList: Cluster[];   //In order to store the list of Clusters
  selectedCluster: Cluster; //In order to store the one to be updated

  //COMPONENT ATTRIBUTES
  visibleSelectedCluster = false;

  addClusterForm = new FormGroup({
    clusterNameInput: new FormControl('', [Validators.required, Validators.min(2)]),
    clusterDescriptionInput: new FormControl('', [Validators.required, Validators.min(4)]),
    //clusterReportDateInput: new FormControl('', [Validators.required, Validators.min(9)]) //Considering DD:MM:YYYY
  });

  editClusterForm = new FormGroup({
    clusterNameEdit: new FormControl('', [Validators.required, Validators.min(2)]),
    clusterDescriptionEdit: new FormControl('', [Validators.required, Validators.min(4)]),
    clusterReportDateEdit: new FormControl('', [Validators.required, Validators.min(9)]) //Considering DD:MM:YYYY
  });

  constructor(
    private clusterService: ClusterService
  ) { }

  ngOnInit(): void {
    this.getClusters();
  }

  public getClusters(){
    this.clusterList = [];               //To reset the List
    this.selectedCluster = new Cluster(); //To reset the selected Student

    this.clusterService.getClusters()
    .subscribe(res => {
      this.clusterList = res as Cluster[];
      console.log(res);
    });
  }

  public getCluster(i:number){
    this.visibleSelectedCluster = false;

    let selectedClusterId = this.clusterList[i]._id;

    this.clusterService.getCluster(selectedClusterId)
      .subscribe(res => {
        this.selectedCluster = res as Cluster;
      });

    this.visibleSelectedCluster = true;
  }

  public addCluster(){
    let newcluster = new Cluster();
    newcluster.name = this.addClusterForm.get('clusterNameInput').value;
    newcluster.description = this.addClusterForm.get('clusterDescriptionInput').value;
    //newcluster.reportdate = Date.now();
    
    this.clusterService.addCluster(newcluster)
    .subscribe(res => {
      let addedcluster = res as Cluster;
      if(addedcluster.name == newcluster.name && addedcluster.description == newcluster.description)
        alert(`Cluster ${addedcluster.name} created successfully`);
      else
        alert(`Could not create the Cluster`);
    });
  }

  public editCluster(){
    this.clusterService.editCluster(this.selectedCluster._id, this.selectedCluster)
    .subscribe(res => {
      let editedcluster = res as Cluster;
      if(editedcluster.name == this.editClusterForm.get('clusterNameEdit').value && editedcluster.description == this.editClusterForm.get('clusterDescriptionEdit').value &&  editedcluster.reportdate== this.editClusterForm.get('clusterReportDateEdit').value)
        alert(`Cluster ${editedcluster.name} edited successfully`);
      else
        alert(`Could not edit the Cluster`);
    });
  }

}

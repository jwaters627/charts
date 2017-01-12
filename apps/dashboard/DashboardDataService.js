'use strict';

import {ActionObserver} from 'ch-flux';
import {chFetch} from 'ch-ui-lib';
import moment from 'moment';

var teamID = 1;

@ActionObserver
class DashboardDataService {
    constructor(actions) {
        this.actions = actions;
        this.observe([
            [actions.loadUser, this.loadUser],
            [actions.loadData, this.loadData],
            [actions.loadDashboards, this.loadDashboards],
            [actions.loadDashboard, this.loadDashboard],
            [actions.createDashboard, this.createDashboard],
            [actions.editDashboard, this.editDashboard],
            [actions.deleteDashboard, this.deleteDashboard],
            [actions.deleteDashboards, this.deleteDashboards],
            [actions.loadUsers, this.loadUsers],
            [actions.loadSharing, this.loadSharing],
            [actions.shareWithUsers, this.shareWithUsers],
            [actions.removeShare, this.removeShare],
            [actions.createCard, this.createCard],
            [actions.editCard, this.editCard],
            [actions.editCards, this.editCards],
            [actions.deleteCard, this.deleteCard],
            [actions.loadVisualizationData, this.loadVisualizationData]
        ]);

    }

    errorResponse = (res) => {
        if (res.error && res.error.status == 403) {
            this.actions.error({
                header: "Oops!",
                text: "Either your session has expired or you don't have permission to view this dashboard. " +
                    "Try refreshing your browser. If that doesn't work, ask the owner of this dashboard to " +
                    "share it with you in order to view it."
            });
        } else {
            console.log(res);
        }

        this.actions.loading(false);
    }

    loadUser() {
        //chFetch.get('/ch/team/' + teamID + '/users').then(res => {
            //let user = res.body;
            //this.actions.loadedUser({user});
        //}).catch(this.errorResponse);
    }

    loadData() {
        //chFetch.get('/ch/monitors/team/' + teamID + '/user/' + userID).then(res => {
            //this.actions.loadedData({monitors: res.body});
        //}).catch(this.errorResponse);
    }

    loadDashboards() {
        //chFetch.get('/ch/newdashboard/list').then(res => {
            //this.actions.loadedDashboards({dashboards: res.body});
        //}).catch(this.errorResponse);
    }

    loadDashboard(data) {
        //chFetch.get('/ch/newdashboard/get/' + data.payload.id).then(res => {
            //this.actions.loadedDashboard(res.body);
        //}).catch(this.errorResponse);
    }

    createDashboard(data) {
        //chFetch.post('/ch/newdashboard', data.payload).then(res => {
            //this.actions.loadedDashboard(res.body);
           // window.location.href = '/ch/newdashboard/' + res.body.id;
        //}).catch(this.errorResponse);
    }

    editDashboard(data) {
        //chFetch.put('/ch/newdashboard', data.payload).then(res => {
           // this.actions.editedDashboard(res.body);
        //}).catch(this.errorResponse);
    }

    deleteDashboard(data) {
        //chFetch.delete('/ch/newdashboard/' + data.payload.id).then(res => {
           // window.location.href = '/ch/newdashboard';
        //}).catch(this.errorResponse);
    }

    deleteDashboards(data) {
        let promises = [];
        //data.payload.forEach(function(dashboard) {
           //promises.push(chFetch.delete('/ch/newdashboard/' + dashboard.id).promise());
        //});

        //Promise.all(promises).then(() => {
            //this.actions.deletedDashboards(data.payload);
        //}).catch(this.errorResponse);
    }

    loadUsers(data) {
        //chFetch.get('/ch/team/users/' + data.payload.id).then(res => {
            //this.actions.loadedUsers(res.body);
        //}).catch(this.errorResponse);
    }

    loadSharing(data) {
        //chFetch.get('/ch/newdashboard/share/users/' + data.payload.id).then(res => {
           // this.actions.loadedSharing(res.body);
        //}).catch(this.errorResponse);
    }

    shareWithUsers(data) {
        //chFetch.put('/ch/newdashboard/share', data.payload).then(res => {
            //this.actions.sharedWithUsers(data.payload);
        //}).catch(this.errorResponse);
    }

    removeShare(data) {
        //chFetch.put('/ch/newdashboard/unshare', data.payload).then(res => {
            //this.actions.removedShare(data.payload);
        //}).catch(this.errorResponse);
    }

    createCard(data) {
        let name = (data.payload.type == 'html') ? 'Embed' : data.payload.type[0].toUpperCase() + data.payload.type.substr(1);
        let card = {
            name: name,
            x: data.payload.x,
            y: data.payload.y,
            width: 4,
            height: 6,
            type: data.payload.type.toUpperCase(),
            dashboardId: data.payload.dashboardId,
            data: data.payload.monitorId,
            dateRange: data.payload.dateRange || '7'
        };
        let vizData = {"start":1475452800,"end":1477958400,"sentiments":{"1475452800":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":30600},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":99374},{"categoryId":620420858,"categoryName":"Basic Negative","volume":23027}],"1475539200":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":10794},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":39195},{"categoryId":620420858,"categoryName":"Basic Negative","volume":7180}],"1475625600":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":9559},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":35816},{"categoryId":620420858,"categoryName":"Basic Negative","volume":6211}],"1475712000":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1475798400":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":14344},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":49696},{"categoryId":620420858,"categoryName":"Basic Negative","volume":8957}],"1475884800":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1475971200":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1476057600":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":15543},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":55494},{"categoryId":620420858,"categoryName":"Basic Negative","volume":8960}],"1476144000":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":14867},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":59286},{"categoryId":620420858,"categoryName":"Basic Negative","volume":9419}],"1476230400":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":19078},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":74154},{"categoryId":620420858,"categoryName":"Basic Negative","volume":11996}],"1476316800":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":13016},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":54513},{"categoryId":620420858,"categoryName":"Basic Negative","volume":7320}],"1476403200":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1476489600":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1476576000":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1476662400":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":16972},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":61969},{"categoryId":620420858,"categoryName":"Basic Negative","volume":9827}],"1476748800":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":16120},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":64769},{"categoryId":620420858,"categoryName":"Basic Negative","volume":9621}],"1476835200":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":12975},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":49000},{"categoryId":620420858,"categoryName":"Basic Negative","volume":7597}],"1476921600":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":11905},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":45916},{"categoryId":620420858,"categoryName":"Basic Negative","volume":7698}],"1477008000":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":109},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":289},{"categoryId":620420858,"categoryName":"Basic Negative","volume":47}],"1477094400":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1477180800":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1477267200":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":10831},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":40692},{"categoryId":620420858,"categoryName":"Basic Negative","volume":6708}],"1477353600":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":51032},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":197058},{"categoryId":620420858,"categoryName":"Basic Negative","volume":30319}],"1477440000":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":5654},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":21134},{"categoryId":620420858,"categoryName":"Basic Negative","volume":3430}],"1477526400":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":19602},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":75180},{"categoryId":620420858,"categoryName":"Basic Negative","volume":11811}],"1477612800":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":10203},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":37113},{"categoryId":620420858,"categoryName":"Basic Negative","volume":5304}],"1477699200":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1477785600":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":0},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":0},{"categoryId":620420858,"categoryName":"Basic Negative","volume":0}],"1477872000":[{"categoryId":620420857,"categoryName":"Basic Positive","volume":9715},{"categoryId":620420864,"categoryName":"Basic Neutral","volume":35536},{"categoryId":620420858,"categoryName":"Basic Negative","volume":5748}]}}
        //chFetch.post('/ch/newdashboard/visualization', card).then(res => {
            //res.body['type'] = data.payload.type;
           // res.body['monitorId'] = data.payload.monitorId;
            //res.body['monitorType'] = data.payload.monitorType;
            this.actions.createdCard(vizData);
        //}).catch(this.errorResponse);
    }

    editCard(data) {
        //chFetch.put('/ch/newdashboard/visualization', data.payload).then(res => {
            res.body['dateRange'] = data.payload.dateRange;
            //this.actions.editedCard(res.body);
        //}).catch(this.errorResponse);
    }

    editCards(data) {
        //chFetch.put('/ch/newdashboard/editvisualizations', data.payload).then(res => {
            //this.actions.loadedDashboard(res.body);
        //}).catch(this.errorResponse);
    }

    deleteCard(data) {
        //chFetch.delete('/ch/newdashboard/visualization/' + data.payload.cardProps.id).then(res => {
           //this.actions.deletedCard(data.payload.cardProps.id);
        //}).catch(this.errorResponse);
    }

    loadVisualizationData(data) {
        let endpoints = {
            'volume': '/volume',
            'retweets': '/retweets',
            'influencers': '/influencers',
            'hashtags': '/hashtags',
            'mentions': '/mentions',
            'sentiment': '/sentiment',
            'dayandtime': '/volume/group-by-hour',
            'impressions': '/totalImpressions',
            'gender': '/volume/group-by-gender',
            'ethnicity': '/volume/group-by-ethnicity',
            'age': '/volume/group-by-age'
        };
        let start = data.payload.start;
        let end = data.payload.end;
        //chFetch.get('/ch/monitor/' + data.payload.monitorId + endpoints[data.payload.type] + '?start=' + start + '&end=' + end).then(res => {
            //res.body['dateRange'] = data.payload.dateRange;
            //this.actions.loadedVisualizationData({id: data.payload.id, data: res.body, type: data.payload.type});
        //}).catch(this.errorResponse);
    }
}

export default DashboardDataService;
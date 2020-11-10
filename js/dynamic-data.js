// EVENT LISTENER
document.addEventListener('DOMContentLoaded', function(){
  const parsedData = parseData();
  const labelData = window.dataForLabels;
  
  if(parsedData && labelData) {
    renderElements(parsedData);

    document.getElementById('photo').style.backgroundImage = `url('${window.dataForCV.imageUrl}')`;
    // document.getElementById('fullAdress').innerHTML = 
    assignAttrValToElements(getDynamicAttrElements('[data-value]'), 'data-value', parsedData);
    assignAttrValToElements(getDynamicAttrElements('[data-class]'), 'data-class', parsedData);
    assignAttrValToElements(getDynamicAttrElements('[data-label]'), 'data-label', window.dataForLabels);
  }
});

function getDynamicAttrElements(attrName) {
  const dynamicAttrElementsSelector = attrName;
  const dynamicAttrElements = document.querySelectorAll(attrName);
  return dynamicAttrElements;
}

function assignAttrValToElements(elements, attrName, data) {
  if(elements && elements.length && attrName) {
    for(let element of elements) {
      const currentElement = element;
      const attributeValue = currentElement.getAttribute(attrName);

      if(currentElement && attributeValue) {
        const valueFromData = data[attributeValue];

        if(attrName === 'data-class') {
          addClassToElement(currentElement, valueFromData);
        } else {
          insertValueIntoElements(currentElement, valueFromData);
        }
      }
    }
  }
}

function insertValueIntoElements(element, attrVal) {
  if(element && attrVal) {
    element.innerHTML = attrVal;
  }
}

function addClassToElement(element, classes) {
  if(element && classes) {
    const singleClassArray = classes.split(' ');

    for(let classPart of singleClassArray) {
      const singleClass = classPart;

      if(singleClass) {
        const existingClass = checkExistingClass(element, singleClass);

        if(!existingClass) {
          if(element.classList) {
            element.classList.add(singleClass);
          } else {
            element.className += ' ' + singleClass;
          }
        }
      }
    }
  }
  element.classList.add('fa-2x')
}

function checkExistingClass(element, className) {
  if(!element) return;

  return element.classList ?
    element.classList.contains(className) :
    new RegExp('\\b' + className + '\\b').test(element.className);
}

function parseData() {
  if(window.dataForCV) {
    window.dataForCV.name = window.dataForCV.firstName + " " + window.dataForCV.lastName;
    if(window.dataForCV.address) {
      window.dataForCV.fullAddress =
          window.dataForCV.address.street + " " +
          window.dataForCV.address.city + " " +
          window.dataForCV.address.country;
    }
    if(window.dataForCV.social) {
      for(let network in window.dataForCV.social) {
        const networkUrl = network + "URL";
        const networkIcon = networkUrl + "Icon";
        const networkName = window.dataForCV.social[network].name;
        window.dataForLabels[networkUrl] = networkName;
        window.dataForCV[networkUrl] = window.dataForCV.social[network].url; 
        window.dataForCV[networkIcon] = window.dataForCV.social[network].icon;
      }
    }
  }
  return window.dataForCV;
};



function renderElements(data) {
  function renderSectionCollectionElements(sectionID) {
    const elementSelector = window.elementIDs[sectionID];
    const element = document.getElementById(elementSelector);
    const sectionProperties = window.sectionProperties[sectionID];
    
    if(data && sectionProperties && sectionProperties[0]) {
      const checkProperty = sectionProperties[0].checkProperty;
      const sectionItems = data[checkProperty];
      
      if(sectionItems) {
        for(let i = 0; i < sectionItems.length; i++) {
          const currentItem = sectionItems[i];
          const clonedElement = element.cloneNode(true);
          const dataLabelChildren = clonedElement.querySelectorAll('[data-label]');
          const dataValueChildren = clonedElement.querySelectorAll('[data-value]');
          const dataFillChildren = clonedElement.querySelectorAll('[data-fill]');
          
          clonedElement.removeAttribute('id');
          replaceElementValues(dataValueChildren, 'data-value', currentItem);
          element.parentNode.appendChild(clonedElement);
          incrementalFill(dataFillChildren, currentItem, 0);
        }
        element.parentNode.removeChild(element);
      }
    }
  };

  function replaceElementValues(elements, attrName, itemData) {
    for(let i = 0; i < elements.length; i++) {
      const currentElement = elements[i];
      const currentAttrValue = currentElement.getAttribute(attrName);
      const splitAttr = currentAttrValue.split('.');
      const itemDataProperty = splitAttr[splitAttr.length - 1];
      
      if(itemData && itemData[itemDataProperty]) {
        const valueFromItemData = itemData[itemDataProperty];
        currentElement.innerHTML = valueFromItemData;
        currentElement.removeAttribute(attrName);
      }
    }
  };

  function incrementalFill(elements, data, timeoutValue) {
    setTimeout(() => {
      replaceProgressVal(elements, 'data-fill', data);
    }, timeoutValue);
  };

  function replaceProgressVal(elements, attrName, itemData) {
    for(let i = 0; i < elements.length; i++) {
      const currentElement = elements[i];
      const currentAttrVal = currentElement.getAttribute(attrName);
      const currentAttrValSplit = currentAttrVal.split('.');
      const itemDataProperty = currentAttrValSplit[currentAttrValSplit.length - 1];

      if(itemData && itemData[itemDataProperty]) {
        const valueFromData = itemData[itemDataProperty];
        

        currentElement.value = valueFromData;
        currentElement.removeAttribute(attrName);
      }
    }
  };


  function renderSectionElements(sectionID) {
    const elementSelector = window.elementIDs[sectionID];
    const element = document.getElementById(elementSelector);
    const sectionProperties = window.sectionProperties[sectionID];

    if(data && sectionProperties) {
      for(let property of sectionProperties) {
        const currentInfoProperty = property;
        const checkProperty = currentInfoProperty.checkProperty;
        const attributeValue = currentInfoProperty.attributeValue;

        if(data[checkProperty]) {
          const cloneElement = element.cloneNode(true);
          const dataLabelChildren = cloneElement.querySelectorAll('[data-label]');
          const dataValueChildren = cloneElement.querySelectorAll('[data-value]');
          const dataClassChildren = cloneElement.querySelectorAll('[data-class]');

          cloneElement.removeAttribute('id');

          replaceAttributeValues(dataLabelChildren, 'data-label', attributeValue);
          replaceAttributeValues(dataValueChildren, 'data-value', attributeValue);
          replaceAttributeValues(dataClassChildren, 'data-class', attributeValue);

          element.parentNode.appendChild(cloneElement);
        }
      }
      element.parentNode.removeChild(element);
    }
  }

  function replaceAttributeValues(elements, attrName, attrValue) {
    for(let element of elements) {
      const currentElement = element;

      currentElement.removeAttribute(attrName);

      if(attrName === 'data-class') {
        attrValue += 'Icon';
        this.className = '';
      }

      currentElement.setAttribute(attrName, attrValue);
    }
  }



  // LOOPING THROUGH ELEMENT IDS
  for(let propertyName in window.elementIDs) {
    if(['references', 'experience', 'education', 'skillsets'].some(el => el === propertyName)) {
      renderSectionCollectionElements(propertyName);
    } else {
      renderSectionElements(propertyName);
    }
  };
};

window.elementIDs = {
  info: 'info-item',
  social: 'social-item',
  references: 'references-item',
  experience: 'experience-item',
  education: 'education-item',
  skillsets: 'skillsets-item',
}

window.sectionProperties = {
  info: [{
      checkProperty: 'firstName',
      attributeValue: 'name'
  }, {
      checkProperty: 'address',
      attributeValue: 'fullAddress'
  }, {
      checkProperty: 'phone',
      attributeValue: 'phone'
  }, {
      checkProperty: 'email',
      attributeValue: 'email'
  }, {
      checkProperty: 'website',
      attributeValue: 'website'
  }],
  social: [{
      checkProperty: 'facebookURL',
      attributeValue: 'facebookURL',
  },{
      checkProperty: 'twitterURL',
      attributeValue: 'twitterURL'
  }, {
      checkProperty: 'instagramURL',
      attributeValue: 'instagramURL'
  }, {
      checkProperty: 'skypeURL',
      attributeValue: 'skypeURL'
  }, {
      checkProperty: 'githubURL',
      attributeValue: 'githubURL'
  }, {
      checkProperty: 'pintrestURL',
      attributeValue: 'pintrestURL'
  }],
  references: [{
      checkProperty: 'references',
      attributeValue: 'references'
  }],
  experience: [{
      checkProperty: 'experience',
      attributeValue: 'experience'
  }],
  education: [{
      checkProperty: 'education',
      attributeValue: 'education'
  }],
  skillsets: [{
      checkProperty: 'skills',
      attributeValue: 'skills'
  }]
};


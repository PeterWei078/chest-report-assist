// ChestScope Helper — Pre-loaded Clinical Templates
// All report templates with [option1/option2] dropdown placeholders and [x] input placeholders

window.TEMPLATE_DATA = {
  version: "1.0.0",
  categories: [
    // ===== Category 1: Chest Ultrasound =====
    {
      id: "chest-us",
      nameEn: "Chest Ultrasound",
      nameZh: "胸腔超音波",
      icon: "🫁",
      reportTitle: "Chest Ultrasound Report",
      defaultTechnique: "Bedside lung ultrasound (LUS) was performed using a [low-frequency curvilinear/high-frequency linear/phased array] probe ([2-5/3.5-5/5-12] MHz) in B-mode and M-mode. Systematic scanning of anterior, lateral, and posterior zones bilaterally was conducted with the patient in [sitting/supine/lateral decubitus] position.",
      subcategories: [
        // 1. Normal
        {
          id: "chest-us-normal",
          nameEn: "Normal",
          nameZh: "正常報告",
          tags: ["most-used"],
          findings: "Bilateral lung fields were evaluated systematically.\n\nLung Sliding: Normal lung sliding is present bilaterally in all zones, confirming pleural apposition.\nA-lines: Normal horizontal reverberation artifacts (A-lines) are seen bilaterally, indicating normal aeration.\nB-lines: No significant B-lines are identified in any zone.\nPleural Effusion: No pleural effusion is detected on either side.\nConsolidation: No lung consolidation or hepatization is noted.\nPneumothorax: No evidence of pneumothorax. Lung sliding is preserved and no lung point is identified.\nDiaphragm: Normal diaphragmatic excursion bilaterally, with smooth and regular movement during respiration.\nPleura: The pleural line appears smooth and regular without thickening or irregularity.",
          impression: "Normal bilateral lung ultrasound. No pleural effusion, consolidation, or pneumothorax.",
          interventional: ""
        },
        // 2. Pleural Effusion
        {
          id: "pleural-effusion",
          nameEn: "Pleural Effusion",
          nameZh: "肋膜積液",
          tags: ["most-used"],
          findings: "A [small/moderate/large] amount of [right/left/bilateral]-sided pleural effusion is noted.\nThe effusion appears [anechoic, consistent with a simple transudative process/hypoechoic with internal echoes and floating debris, suggestive of an exudative effusion/complex with thick septations and loculations, fibrinous strands forming plexiform patterns, raising concern for complicated parapneumonic effusion or early empyema/homogeneously echogenic with dense debris, highly suspicious for empyema or hemothorax].\nQuad sign and sinusoid sign are [clearly demonstrated/present] on M-mode.\nMaximum depth is approximately [x] cm at the [posterior costophrenic angle/mid-axillary line/posterior axillary line].\nEstimated volume is approximately [x] mL.\n[No septations or loculations are observed within the effusion./Focal septations and loculations are noted within the effusion.]\n[No evidence of pleural thickening or nodularity./Mild pleural thickening is noted without discrete nodularity./Pleural thickening with nodularity is noted, raising concern for malignant involvement.]\nThe underlying lung parenchyma [appears normal with preserved aeration/shows partial atelectasis/shows compressive atelectasis with hepatization].\nDiaphragm is [clearly visualized with normal movement/displaced inferiorly by the effusion/poorly visualized due to the large effusion].",
          impression: "[Right/Left/Bilateral] [small/moderate/large] pleural effusion, [simple anechoic/complex with internal echoes/septated and loculated/echogenic suggestive of empyema or hemothorax]. Estimated volume [x] mL.",
          interventional: "Ultrasound-Guided Thoracentesis:\nUnder real-time ultrasound guidance, the patient was placed in the [sitting/lateral decubitus] position with [right/left] side exposed. The [right/left] [posterior axillary line/mid-axillary line] at the [x]th intercostal space (above the diaphragm) was identified as the optimal puncture site, confirmed by visualization of free-flowing fluid with a safe depth of [x] cm and no intervening lung or vessels.\nThe site was prepped and draped in sterile fashion using chlorhexidine. Local anesthesia with 1% lidocaine was administered to skin and subcutaneous tissue.\nA [18/16/14]-gauge [Safe-T-Centesis catheter-over-needle/pigtail catheter/needle] was advanced under continuous ultrasound visualization. Upon entry into the pleural space (confirmed by free aspiration of fluid and real-time sonographic visualization), approximately [x] mL of [serous/serosanguinous/turbid/purulent/bloody] fluid was [slowly drained/aspirated] without resistance.\nThe [catheter was removed/pigtail catheter was secured in place for continuous drainage] after drainage, and the site was dressed with sterile gauze.\nNo immediate complications (e.g., pneumothorax, bleeding, or vasovagal reaction) were observed.\nPost-procedure lung ultrasound confirmed [significant reduction in effusion size with re-expansion of the lower lobe/near-complete resolution of the effusion/partial reduction with residual loculated fluid].\nFluid was sent for: cell count, Gram stain, culture, pH, LDH, protein, glucose, cytology, and AFB."
        },
        // 3. Lung Consolidation
        {
          id: "lung-consolidation",
          nameEn: "Lung Consolidation / Atelectasis",
          nameZh: "肺實質化／肺塌陷",
          tags: ["most-used"],
          findings: "A [focal/extensive] area of lung consolidation is noted in the [right upper lobe/right middle lobe/right lower lobe/left upper lobe/left lingula/left lower lobe].\nThe consolidation demonstrates [hepatization sign (tissue-like echotexture resembling liver parenchyma)/hypoechoic parenchyma with loss of normal aeration pattern].\n[A shred sign (irregular, fractal-like border between consolidated and aerated lung) is noted at the pleural interface./The border between consolidated and aerated lung is well-defined.]\nAir bronchograms: [Multiple dynamic air bronchograms are visible (hyperechoic branching structures moving centrifugally with respiration), confirming patent airways and active pneumonia rather than obstructive atelectasis./Static air bronchograms are present without respiratory movement, suggestive of obstructive atelectasis or resorptive process./No air bronchograms are identified.]\n[Fluid bronchograms (anechoic tubular structures) are noted within the consolidated lung./No fluid bronchograms are observed.]\nScattered B-lines are noted at the periphery of the consolidation.\nLung sliding is [reduced but preserved/absent] over the consolidated area.\n[An associated small pleural effusion is noted adjacent to the consolidation./No associated pleural effusion.]\nThe consolidation measures approximately [x] x [x] cm in [transverse/longitudinal] dimensions.",
          impression: "[Right/Left] [upper/middle/lower] lobe consolidation with [hepatization sign and dynamic air bronchograms, consistent with pneumonia/static air bronchograms, suggestive of obstructive atelectasis/compressive atelectasis]. [Associated small parapneumonic effusion noted./No associated effusion.]",
          interventional: ""
        },
        // 4. Pneumothorax
        {
          id: "pneumothorax",
          nameEn: "Pneumothorax",
          nameZh: "氣胸",
          tags: [],
          findings: "Evaluation for pneumothorax was performed with systematic scanning of anterior and lateral chest wall bilaterally.\n\n[Right/Left] side:\nLung sliding: [Absent in the anterior chest from the [x]th intercostal space, indicating pneumothorax./Present in all zones, ruling out pneumothorax at the scanned areas.]\nM-mode: [Barcode sign (stratosphere sign) is demonstrated, confirming absence of lung sliding consistent with pneumothorax./Seashore sign (sandy beach pattern) is present, confirming normal pleural sliding.]\nB-lines: [Absent in the affected area (consistent with pneumothorax — B-lines are generated at the visceral-parietal pleural interface and cannot be seen when air separates them)./Present, which effectively rules out pneumothorax in this region.]\nLung point: [A lung point is identified at the [anterior axillary line/mid-axillary line/posterior axillary line] at the [x]th intercostal space, with intermittent lung sliding alternating with barcode sign, indicating the boundary of the pneumothorax./No lung point is identified (may indicate large pneumothorax or the lung point is beyond the accessible scanning area).]\nLung pulse: [Absent, consistent with pneumothorax./Present, indicating visceral pleura apposition.]\n\nContralateral [left/right] side:\nNormal lung sliding and seashore sign present. No evidence of pneumothorax.",
          impression: "[Right/Left]-sided pneumothorax with absent lung sliding and [barcode sign/stratosphere sign]. Lung point identified at [location], suggesting [small/moderate/large] pneumothorax. [Contralateral lung appears normal./Bilateral pneumothorax suspected.]",
          interventional: ""
        },
        // 5. Tumor / Nodule / Peripheral Lung Lesion
        {
          id: "tumor-nodule",
          nameEn: "Tumor / Nodule / Peripheral Lesion",
          nameZh: "腫瘤／結節／周邊肺病變",
          tags: [],
          findings: "A [well-defined/ill-defined/irregular] [hypoechoic/isoechoic/heterogeneous] lesion is identified in the [right/left] [upper/middle/lower] lung field, [abutting/invading] the pleura.\nThe lesion measures approximately [x] x [x] x [x] cm.\nBorder characteristics: [Smooth and well-circumscribed, suggesting benign etiology./Irregular and spiculated margins, raising concern for malignancy./Lobulated contour with mixed echogenicity.]\n[Color Doppler shows internal vascularity with [minimal/moderate/prominent] blood flow./No significant internal vascularity is detected on color Doppler.]\n[An associated pleural effusion is present [ipsilaterally/bilaterally]./No associated pleural effusion.]\n[The lesion appears to invade the chest wall with disruption of the pleural line./The pleural line is intact with no evidence of chest wall invasion.]\n[Surrounding lung parenchyma shows [scattered B-lines/obstructive atelectasis/normal aeration]./The surrounding parenchyma appears normal.]\n[Air bronchograms are seen within the lesion, possibly representing tumor-infiltrated lung parenchyma./No air bronchograms are identified within the lesion.]\n[Mediastinal lymphadenopathy is not evaluable by this modality./Subpleural satellite nodules are noted.]",
          impression: "[Right/Left] [upper/middle/lower] lobe peripheral [mass/nodule/lesion], measuring [x] x [x] x [x] cm, [well-defined suggesting benign etiology/ill-defined with irregular margins suspicious for malignancy]. [Associated pleural effusion./No effusion.] [Chest wall invasion suspected./No chest wall invasion.] Tissue sampling recommended for definitive diagnosis.",
          interventional: "Ultrasound-Guided Percutaneous Biopsy:\nUnder real-time ultrasound guidance, the patient was placed in [sitting/supine/lateral decubitus] position. The [right/left] [posterior/lateral/anterior] chest wall was identified as the optimal approach, with the lesion clearly visualized abutting the pleura.\nThe site was prepped and draped in sterile fashion. Local anesthesia with 1% lidocaine was administered.\nA [18/16]-gauge [core biopsy needle/cutting needle] was advanced under continuous ultrasound visualization into the lesion. [x] passes were performed, and [x] tissue cores were obtained. The specimens appeared [grossly adequate/whitish and firm/friable and hemorrhagic].\nSamples were sent for pathology (histology and [immunohistochemistry/cytology/flow cytometry]).\nPost-procedure ultrasound showed [no evidence of pneumothorax/a small apical pneumothorax/no significant change]. [No bleeding at the puncture site./Mild oozing controlled with local pressure.]\nThe patient was monitored for [x] hours post-procedure with no complications."
        },
        // 6. Others
        {
          id: "chest-us-others",
          nameEn: "Others",
          nameZh: "其他（胸壁、膿瘍、縱膈、橫膈）",
          tags: [],
          findings: "[Chest Wall Lesion: A [well-defined/ill-defined] [hypoechoic/heterogeneous/anechoic] lesion is noted within the [chest wall soft tissue/intercostal space/rib], measuring [x] x [x] cm. [The lesion appears to originate from the [subcutaneous tissue/muscle/rib]. /The lesion disrupts the rib cortex, raising concern for bony involvement.] [No internal vascularity on color Doppler./Internal vascularity is demonstrated.]/Lung Abscess: A [round/irregular] [thick-walled/thin-walled] cavity is identified within the [right/left] [upper/middle/lower] lobe, measuring [x] x [x] cm. The wall thickness is approximately [x] mm. The cavity contains [air-fluid level/echogenic debris/predominantly fluid content]. Surrounding consolidation [is/is not] present. [Color Doppler demonstrates increased vascularity in the abscess wall./No significant vascularity.]/Mediastinal Mass: A [well-defined/ill-defined] [solid/cystic/mixed] mass is noted in the [anterior/middle/posterior] mediastinum, [visible through the suprasternal/parasternal/supraclavicular] window. The mass measures approximately [x] x [x] cm. [The mass displaces/compresses adjacent structures./No mass effect on adjacent structures.]/Diaphragm Abnormality: [Diaphragmatic paralysis: The [right/left] hemidiaphragm shows paradoxical movement (upward motion during inspiration) on M-mode, consistent with diaphragmatic paralysis. The contralateral hemidiaphragm moves normally./Diaphragmatic eventration: The [right/left] hemidiaphragm appears elevated with thinning, showing reduced excursion of [x] cm (normal >2 cm). /Diaphragmatic hernia: Abdominal contents are visualized above the [right/left] hemidiaphragm through a defect measuring [x] cm.]]",
          impression: "[Chest wall lesion measuring [x] x [x] cm, [likely benign/concerning for malignancy/requiring further evaluation]./Lung abscess in the [right/left] [lobe] with [air-fluid level/debris], measuring [x] cm./Mediastinal mass in the [anterior/middle/posterior] mediastinum, measuring [x] x [x] cm./[Right/Left] diaphragmatic [paralysis/eventration/hernia].]",
          interventional: ""
        }
      ]
    },

    // ===== Category 2: Other Ultrasound / POCUS =====
    {
      id: "other-us",
      nameEn: "Other Ultrasound (POCUS)",
      nameZh: "其他超音波",
      icon: "📋",
      reportTitle: "Point-of-Care Ultrasound (POCUS) Report",
      defaultTechnique: "Bedside point-of-care ultrasound (POCUS) was performed using a [phased array/curvilinear/linear] probe. A focused multi-organ assessment was conducted at the bedside in the [ICU/ER/ward].",
      subcategories: [
        {
          id: "pocus-rapid",
          nameEn: "POCUS Rapid Assessment",
          nameZh: "POCUS 快速評估",
          tags: ["most-used"],
          findings: "1. CARDIAC (Focused Echocardiography):\nSubcostal view: [Adequate/Limited] visualization. Pericardial effusion: [None/Small/Moderate/Large circumferential]. [No evidence of cardiac tamponade./Right atrial diastolic collapse noted, concerning for tamponade physiology.]\nParasternal long axis: [Normal/Reduced] LV systolic function (estimated LVEF [preserved >55%/mildly reduced 40-55%/moderately reduced 30-40%/severely reduced <30%]). [Normal LV chamber size./LV dilatation noted.] [Normal RV size./RV dilatation with RV:LV ratio [<1:1/>1:1].] [No valvular abnormality grossly identified./Valvular abnormality noted.]\nApical 4-chamber: [Normal/Abnormal] biventricular function. [No regional wall motion abnormality./Regional wall motion abnormality noted in [anterior/inferior/lateral/septal] wall.]\n[IVC assessment: IVC diameter [x] cm with [>50%/< 50%] inspiratory collapse, suggesting [low/normal/elevated] right atrial pressure.]\n\n2. LUNG:\n[Bilateral A-lines with normal lung sliding. No B-lines. No pleural effusion. No consolidation./Abnormal findings as documented in chest ultrasound report.]\n\n3. ABDOMEN:\nFree fluid (FAST): [No free fluid in Morrison's pouch, splenorenal recess, or pelvis./Free fluid noted in [Morrison's pouch/splenorenal recess/pelvis/bilateral paracolic gutters], [small/moderate/large] amount.]\nAorta: [Visualized and appears normal in caliber (diameter [x] cm). No aneurysmal dilatation./Abdominal aortic aneurysm noted, measuring [x] cm in maximum diameter./Not adequately visualized due to bowel gas.]\n[Bladder: [Distended with estimated volume [x] mL./Non-distended./Foley catheter in place, bladder decompressed.]]\n[Kidneys: [Normal bilateral renal parenchyma without hydronephrosis./[Right/Left/Bilateral] hydronephrosis noted, [mild/moderate/severe]./Not evaluated.]]\n\n4. DVT SCREENING (if performed):\n[Bilateral lower extremity compression ultrasound: [Fully compressible common femoral and popliteal veins bilaterally, no DVT./Non-compressible [right/left] [common femoral/popliteal/femoral] vein, consistent with deep vein thrombosis./Not evaluated.]]",
          impression: "POCUS Rapid Assessment Summary:\n1. Cardiac: [Normal LV function, no pericardial effusion./Reduced LV function (LVEF ~[x]%). /Pericardial effusion [without/with] tamponade physiology.]\n2. Lung: [Normal bilateral lung ultrasound./Abnormal — see chest US report.]\n3. IVC: [x] cm, [collapsible/non-collapsible], suggesting [low/normal/elevated] CVP.\n4. Abdomen: [No free fluid./Free fluid present in [location].] [Aorta normal./AAA [x] cm.]\n5. [DVT screening: [Negative./Positive — [location].]]\n[Overall assessment: [Findings consistent with [hypovolemia/cardiogenic shock/obstructive shock/distributive shock/normal hemodynamic status]./Findings are non-specific, clinical correlation recommended.]]",
          interventional: ""
        }
      ]
    },

    // ===== Category 3: Bronchoscopy =====
    {
      id: "bronchoscopy",
      nameEn: "Bronchoscopy",
      nameZh: "支氣管鏡檢查",
      icon: "🔬",
      reportTitle: "Bronchoscopy Report",
      defaultTechnique: "[Flexible/Rigid] bronchoscopy was performed under [local anesthesia with conscious sedation/general anesthesia] using a [diagnostic/therapeutic] bronchoscope ([model/brand if applicable]). The scope was introduced [transnasally/transorally/via endotracheal tube/via tracheostomy]. [Midazolam [x] mg and fentanyl [x] mcg were administered for sedation./General anesthesia was maintained with [propofol/sevoflurane].] Topical lidocaine ([1%/2%]) was applied to the airway. [Continuous pulse oximetry and cardiac monitoring were maintained throughout the procedure./The patient was monitored in the ICU setting.]",
      subcategories: [
        // 1. Normal
        {
          id: "bronch-normal",
          nameEn: "Normal",
          nameZh: "正常報告",
          tags: ["most-used"],
          findings: "Vocal Cords: [Normal/Bilateral] vocal cord mobility. No vocal cord paralysis, edema, or lesion.\nTrachea: Normal tracheal lumen and mucosa. No tracheal stenosis, malacia, or endobronchial lesion. Tracheal rings are intact.\nCarina: Sharp and [normal/widened]. No evidence of subcarinal compression or infiltration.\nRight Bronchial Tree: Right main bronchus, right upper lobe bronchus (with B1, B2, B3 segments), bronchus intermedius, right middle lobe bronchus (B4, B5), and right lower lobe bronchus (B6-B10) are all patent with normal mucosa. No endobronchial lesion, stenosis, or secretion.\nLeft Bronchial Tree: Left main bronchus, left upper lobe bronchus (with upper division B1+2, B3 and lingular division B4, B5), and left lower lobe bronchus (B6-B10) are all patent with normal mucosa. No endobronchial lesion, stenosis, or secretion.\nSecretions: [Minimal clear secretions noted, consistent with normal./No significant secretions.]\nMucosa: Normal pink mucosa throughout without hyperemia, edema, or granulation tissue.",
          impression: "Normal flexible bronchoscopy. Patent airways bilaterally with no endobronchial lesion, stenosis, or active bleeding.",
          interventional: ""
        },
        // 2. Airway Inflammation
        {
          id: "airway-inflammation",
          nameEn: "Airway Inflammation",
          nameZh: "氣道炎症",
          tags: [],
          findings: "Airway inflammatory changes are noted in the following locations:\n\n[Trachea/Right main bronchus/Left main bronchus/Right upper lobe/Right middle lobe/Right lower lobe/Left upper lobe/Lingula/Left lower lobe/Bilateral diffuse]: [Mild/Moderate/Severe] mucosal [hyperemia (erythema)/edema/thickening/roughness/friability].\n[The mucosa appears swollen and erythematous with increased vascularity./The mucosal surface is irregular and granular./Cobblestone-like mucosal pattern is noted, suggesting chronic inflammation.]\n[Mucosal edema causing partial narrowing of the [affected airway], with approximately [x]% luminal reduction./No significant luminal narrowing despite mucosal changes.]\n[Increased mucoid/mucopurulent secretions are present in the [affected area], which were [aspirated/lavaged]./Secretions are minimal.]\n[No discrete endobronchial mass or lesion./A focal area of mucosal irregularity is noted at [location], warranting biopsy.]\n[Remaining airways appear normal without inflammatory changes./Inflammatory changes are diffuse throughout the tracheobronchial tree.]",
          impression: "[Localized/Diffuse] airway inflammation with [hyperemia/edema/mucosal thickening/roughness/friability] in [affected areas]. [Consistent with [acute bronchitis/chronic bronchitis/tracheobronchitis/post-infectious inflammation/allergic inflammation].] [Approximately [x]% luminal narrowing at [location]./No significant luminal compromise.]",
          interventional: "Bronchoalveolar Lavage (BAL):\nBAL was performed at the [right middle lobe/lingula/affected segment] by wedging the bronchoscope into [segmental/subsegmental] bronchus. A total of [x] mL of sterile normal saline was instilled in [3/5] aliquots of [20/30/50] mL each. Approximately [x] mL ([x]%) of fluid was recovered.\nThe return fluid appeared [clear/turbid/bloody/mucopurulent].\nSpecimens were sent for: cell count and differential, Gram stain, bacterial culture, fungal culture, AFB smear and culture, [cytology/viral PCR/Pneumocystis staining/galactomannan]."
        },
        // 3. Tumor / Neoplasm / Obstruction
        {
          id: "bronch-tumor",
          nameEn: "Tumor / Neoplasm / Obstruction",
          nameZh: "腫瘤／新生物／阻塞",
          tags: ["biopsy"],
          findings: "An [endobronchial mass/exophytic tumor/submucosal infiltration/extrinsic compression] is identified at the [trachea/right main bronchus/left main bronchus/right upper lobe/bronchus intermedius/right middle lobe/right lower lobe/left upper lobe/lingula/left lower lobe] [orifice/lumen/carina].\n\nThe lesion appears [polypoid and pedunculated/sessile and broad-based/infiltrative with submucosal involvement/extrinsic compression causing smooth luminal narrowing].\nSurface characteristics: [Smooth and well-circumscribed/Friable and hemorrhagic/Necrotic with surface ulceration/Covered with intact mucosa (submucosal or extrinsic)].\nColor: [Pink/Red/White/Yellow-white/Hemorrhagic/Necrotic].\nSize: Estimated [x] x [x] cm, [occupying approximately [x]% of the lumen/completely obstructing the lumen].\nDegree of obstruction: [Partial obstruction with [x]% luminal narrowing/Near-complete obstruction with pinhole residual lumen/Complete obstruction with no distal visualization].\nVascularity: [Hypervascular with easy contact bleeding/Moderate vascularity/Avascular appearance].\n[Distal airways are [not visualized due to obstruction/partially visualized beyond the lesion/normal beyond the lesion]./Purulent secretions noted pooling distal to the obstruction.]\n[The contralateral bronchial tree appears normal./Additional lesions noted at [location].]",
          impression: "[Endobronchial mass/Submucosal tumor/Extrinsic compression] at [location] causing [partial ([x]%)/near-complete/complete] airway obstruction. [Highly suspicious for malignancy — biopsy obtained./Differential includes [primary lung cancer/metastatic disease/carcinoid tumor/benign tumor].] [Associated post-obstructive changes noted./Contralateral airways normal.]",
          interventional: "Endobronchial Biopsy:\n[Forceps biopsy: [x] specimens were obtained from the [endobronchial mass/suspicious area] using [standard/jumbo] biopsy forceps. [Bleeding was [minimal/moderate/significant] after biopsy, controlled with [observation/cold saline/topical epinephrine/electrocautery/argon plasma coagulation]./No significant bleeding.]\nSpecimens were sent for pathology (histology, [immunohistochemistry/molecular studies/PD-L1/EGFR/ALK]).\n\n[Brushing: Bronchial brushing was performed at [location]. Specimens were sent for cytology.]\n\n[Needle aspiration (TBNA): Transbronchial needle aspiration was performed at [location/lymph node station [x]] using a [21/22]-gauge needle. [x] passes were made. [Rapid on-site evaluation (ROSE) confirmed [adequate sample/lymphocytes/malignant cells]./Specimens sent for cytology and cell block.]]"
        },
        // 4. Airway Stenosis / Distortion
        {
          id: "airway-stenosis",
          nameEn: "Airway Stenosis / Distortion",
          nameZh: "氣道狹窄／扭曲",
          tags: [],
          findings: "Airway [stenosis/distortion/malacia] is identified at the [trachea (upper/mid/lower third)/subglottic region/right main bronchus/left main bronchus/bronchus intermedius/right upper lobe/right middle lobe/right lower lobe/left upper lobe/left lower lobe].\n\nType: [Intrinsic stenosis (mucosal/submucosal thickening or scarring causing fixed narrowing)/Extrinsic compression (smooth inward bowing of the airway wall from external mass or lymphadenopathy)/Mixed intrinsic and extrinsic stenosis/Dynamic stenosis (malacia — excessive airway collapse during expiration >50%)].\nDegree of narrowing: [Mild (<50%)/Moderate (50-75%)/Severe (>75%)/Near-complete (pinhole lumen)/Complete atresia].\nLength of stenosis: Approximately [x] cm [focal/segmental/diffuse].\nMucosal appearance: [Normal overlying mucosa/Scarred and fibrotic/Edematous and inflamed/Granulation tissue at the stenotic site].\n[The airway is distorted with [angulation/tortuosity/external deviation], likely due to [mediastinal shift/post-surgical changes/fibrotic changes/lymphadenopathy]./No significant airway distortion.]\n[Tracheobronchomalacia: Excessive dynamic collapse of the [tracheal/bronchial] wall (>[50/75]%) during expiration and coughing is noted./No evidence of malacia.]\nDistal airways: [Patent and normal beyond the stenosis/Not accessible due to severe narrowing/Showing additional stenotic segments].",
          impression: "[Intrinsic/Extrinsic/Mixed/Dynamic] airway [stenosis/malacia] at [location], [mild/moderate/severe/near-complete] degree with approximately [x]% luminal narrowing over [x] cm length. [Likely etiology: [post-intubation/post-tracheostomy/post-tuberculosis/malignant/inflammatory/idiopathic].] [Intervention [recommended/performed — see below]./Surveillance recommended.]",
          interventional: ""
        },
        // 5. Foreign Body / Secretion / Bleeding
        {
          id: "foreign-body-secretion",
          nameEn: "Foreign Body / Secretion / Bleeding",
          nameZh: "異物／分泌物／出血",
          tags: ["interventional"],
          findings: "[Foreign Body: A [radiopaque/radiolucent] foreign body is visualized in the [right main/left main/right lower lobe/left lower lobe/trachea/right upper lobe] bronchus. The object appears to be [food material/dental material/metallic/plastic/organic material]. [The foreign body is partially obstructing the airway with approximately [x]% luminal occlusion./The foreign body is completely obstructing the airway.] [Granulation tissue is present around the foreign body, suggesting chronic retention./No surrounding granulation tissue, suggesting acute aspiration.] [Distal airways show [purulent secretions/post-obstructive pneumonia/atelectasis]./Distal airways appear normal.]/Excessive Secretions: [Copious/Moderate] [mucoid/mucopurulent/purulent/bloody/blood-tinged] secretions are noted in the [trachea/right bronchial tree/left bronchial tree/bilateral airways/specific lobe]. [Mucus plugging is causing [partial/complete] obstruction of [affected airway]./Secretions are diffuse without focal obstruction.] [After thorough suctioning, the underlying mucosa appears [normal/inflamed/erythematous]./The secretions re-accumulated rapidly despite suctioning.]/Active Bleeding: [Active bleeding/Blood clots/Blood-tinged secretions] [is/are] identified originating from [the right upper lobe/right middle lobe/right lower lobe/left upper lobe/lingula/left lower lobe/diffuse bilateral/unable to localize source]. [The bleeding appears [arterial (pulsatile, bright red)/venous (oozing, dark red)/mucosal (surface oozing)].] [The bleeding rate is estimated as [mild oozing/moderate/massive].] [The source is identified at [specific location]./The source could not be definitively localized due to diffuse hemorrhage.]]",
          impression: "[Foreign body ([type]) in [location], [partially/completely] obstructing airway. [Successfully removed — see procedure note./Removal attempted — see procedure note./Removal deferred, planned for OR.]/Excessive [mucoid/mucopurulent/purulent] secretions in [location]. [Mucus plugging with [partial/complete] obstruction./Diffuse secretions without focal obstruction.] [Therapeutic suctioning performed.]/Active bleeding from [location], [mild/moderate/massive]. [Source identified at [specific site]./Source not definitively localized.] [Hemostasis achieved./Ongoing bleeding — see intervention note.]]",
          interventional: "[Foreign Body Removal:\nThe foreign body was grasped using [biopsy forceps/basket/cryoprobe/balloon catheter] under direct visualization. [The foreign body was successfully extracted in [one piece/multiple fragments]./Extraction was unsuccessful due to [impaction/granulation tissue/size], and the patient is planned for [rigid bronchoscopy/surgical removal].] [Examination of the distal airway after removal showed [normal mucosa/granulation tissue/inflammation/secretions].]\n\n/Therapeutic Suctioning:\nThorough suctioning was performed throughout the [affected areas/bilateral airways]. [Mucus plugs were successfully cleared, restoring airway patency./Large mucus cast was extracted.] [BAL was performed for microbiological analysis — see BAL report.]\n\n/Hemorrhage Control:\n[Cold saline lavage ([x] mL) was applied with temporary hemostasis achieved./Topical epinephrine (1:10,000) was instilled with [successful hemostasis/temporary reduction in bleeding]./Balloon tamponade was applied at the bleeding segmental bronchus with [successful hemostasis/partial control]./Electrocautery/APC was applied to the bleeding site with [successful coagulation/partial hemostasis]./Oxidized cellulose (Surgicel) was placed at the bleeding site.]\n[Total estimated blood loss: [x] mL.]\n[The patient remained hemodynamically stable throughout./The patient required [vasopressor support/transfusion/intubation] during the procedure.]]"
        },
        // 6. Others (Bronchoscopy)
        {
          id: "bronch-others",
          nameEn: "Others",
          nameZh: "其他（偽膜、肉芽、碳沫、活檢）",
          tags: [],
          findings: "[Pseudomembrane: [Thin/Thick] [white/yellow/gray] pseudomembranous [patches/coating] are noted [overlying the mucosa at [trachea/main bronchi/diffuse]/circumferentially lining the [trachea/bronchi]]. [The pseudomembrane is [easily peelable/firmly adherent] with [intact/erythematous/ulcerated] mucosa underneath.] [Consistent with [Aspergillus tracheobronchitis/pseudomembranous tracheobronchitis/post-transplant changes/chemical/thermal injury].]/Granulation Tissue: [Exuberant/Focal] granulation tissue is noted at [the tracheostomy stoma site/prior anastomosis site/stent margin/prior biopsy site/[specific location]]. [The tissue is [polypoid/flat/circumferential], causing approximately [x]% luminal narrowing.] [Friable with easy contact bleeding./Firm and fibrotic.] [Likely [post-procedural/inflammatory/idiopathic] in etiology.]/Anthracotic Pigmentation (Carbon Deposit): [Diffuse/Focal] anthracotic pigmentation (black-brown discoloration) is noted in the [bronchial mucosa/carinal region/bilateral airways/segmental bronchi]. [The pigmentation appears [superficial mucosal/deep submucosal with tattoo-like pattern].] [Associated mucosal thickening and stenosis of [affected bronchus], consistent with anthracosis-related bronchial stenosis (anthracofibrosis)./No associated stenosis or mucosal changes.] [This is commonly seen in patients with significant [coal dust/biomass fuel/environmental particulate] exposure.]/Post-Biopsy Status: The prior biopsy site at [location] shows [healing mucosa with mild scarring/persistent ulceration/granulation tissue formation/no significant change/complete healing]. [No residual lesion at the biopsy site./A residual [mass/lesion] is noted at the biopsy site, measuring [x] cm.] [No active bleeding from the prior biopsy site./Mild oozing noted at the prior biopsy site.]]",
          impression: "[Pseudomembranous [tracheitis/bronchitis] at [location], [consistent with/suspicious for] [Aspergillus tracheobronchitis/infectious tracheobronchitis/chemical injury]. [Biopsy/culture obtained.]/Granulation tissue at [location] causing [x]% luminal narrowing, likely [post-procedural/inflammatory]. [Intervention performed — see below./Monitoring recommended.]/Anthracotic pigmentation [diffuse/focal], [with/without] associated bronchial stenosis (anthracofibrosis). [Consistent with environmental/occupational exposure.]/Post-biopsy site at [location]: [Healed/persistent lesion/granulation tissue]. [Follow-up recommended./No further intervention needed.]]",
          interventional: "[Granulation Tissue Removal:\nGranulation tissue at [location] was treated with [biopsy forceps debulking/electrocautery/cryotherapy/laser ablation/APC (argon plasma coagulation)]. [x]% of the tissue was successfully removed, with improvement in luminal diameter from [x]% to [x]% stenosis. [Hemostasis was achieved with [cautery/topical agents]./Minimal bleeding.]\nSpecimen sent for pathology.\n\n/EBUS (Endobronchial Ultrasound):\nEBUS-TBNA was performed at lymph node station [2R/2L/4R/4L/7/10R/10L/11R/11L]. The lymph node measured [x] x [x] mm, appearing [round/oval] with [homogeneous/heterogeneous] echogenicity. [Central hilar structure (CHS) was [present/absent].] [x] passes were made using a [21/22]-gauge needle under real-time ultrasound guidance.\n[Rapid on-site evaluation (ROSE) showed [adequate lymphocytes/granulomas/malignant cells/non-diagnostic material].]\nSpecimens sent for [cytology/cell block/flow cytometry/molecular testing/TB culture].]"
        }
      ]
    }
  ],

  // Cross-category tags
  tags: [
    { id: "biopsy", label: "Biopsy" },
    { id: "bal", label: "BAL" },
    { id: "ebus", label: "EBUS" },
    { id: "interventional", label: "Interventional" },
    { id: "follow-up", label: "Follow-up" },
    { id: "most-used", label: "Most Used" }
  ]
};
